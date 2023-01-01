import Ajv from 'ajv';
import Busboy from 'busboy';
import csv from 'csvtojson';
import {SHARED_CONFIG} from 'definitions';
import * as express from 'express';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {constants} from 'http2';
import {CORS} from '../consts/cors-whitelist.const';
import {dbService} from '../consts/dbService.const';
import {safeEval} from '../utils/safe-eval';
import {authenticated} from './middlewares/authenticated';

const app = express();
app.use(CORS);

app.post('/', authenticated(), (req, res) => {
  const ajvInstance = new Ajv();
  const busboy = new Busboy({headers: req.headers});
  const parsedData: any = {};
  let fileData = '';

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileData += data.toString();
    });
  });

  busboy.on('field', (fieldName, val) => {
    if (!parsedData[fieldName]) {
      parsedData[fieldName] = '';
    }

    parsedData[fieldName] += val.toString();
  });

  busboy.on('finish', () => {
    async function exec() {
      const validator = ajvInstance.compile(JSON.parse(parsedData.schema));
      const type = parsedData.type || 'csv';

      // @ts-ignore
      const {permissions} = req['user'];

      if (permissions?.[parsedData.collection]?.create) {
        throw new Error('User does not have permission to import data to this module');
      }

      let jsonObj: any;

      switch (type) {
        case 'csv':
          jsonObj = await csv({
            delimiter: parsedData.delimiter || 'auto'
          }).fromString(fileData);
          break;
        case 'json':
          jsonObj = JSON.parse(fileData);
          break;
      }

      let rowFunction: any;

      if (parsedData['importModule-rowFunction']) {
        rowFunction = safeEval(parsedData['importModule-rowFunction']);
      }

      const {errors, created} = jsonObj.reduce(
        (acc: any, cur: any, index: number) => {
          validator(cur);

          if (validator.errors) {
            acc.errors.push({index, errors: validator.errors});
          } else {
            const {id, ...saveData} = cur;
            if (rowFunction) {
              acc.created.push(async () => {
                const sd = await rowFunction(saveData, req.query);
                return id ? dbService.setDocument(parsedData.collection, id, sd) : dbService.addDocument(parsedData.collection, sd);
              });
            } else {
              acc.created.push(() =>
                id ? dbService.setDocument(parsedData.collection, id, saveData) : dbService.addDocument(parsedData.collection, saveData)
              );
            }
          }

          return acc;
        },
        {
          errors: [],
          created: []
        }
      );

      if (created.length) {
        await Promise.all(created.map((it: any) => it()));
      }

      return {
        created: created.length,
        errors
      };
    }

    exec()
      .then(data => res.json(data))
      .catch(error => {
        functions.logger.error(error);
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({error: error.toString()});
      });
  });

  // @ts-ignore
  busboy.end(req['rawBody']);
});

export const importData = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onRequest(app);
