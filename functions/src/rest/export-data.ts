import * as express from 'express';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {constants} from 'http2';
import {get, has} from 'json-pointer';
import {Parser} from 'json2csv';
import XLSX from 'xlsx';
import {CORS} from '../consts/cors-whitelist.const';
import {authenticated} from './middlewares/authenticated';
import {MODULES, SHARED_CONFIG} from 'definitions';

enum Type {
  csv = 'csv',
  tab = 'tab',
  json = 'json',
  xls = 'xls'
}

const app = express();
app.use(CORS);

function getModules(url: string) {
	return url.split('/').filter((v, index) => index % 2);
}

app.post('/**', authenticated(), (req, res) => {
  async function exec() {
    const modules = getModules(req.url);

    // @ts-ignore
    const {permissions, role} = req['user'];
    const moduleDoc = MODULES.find(mod => !modules.some(id => !mod.id.includes(id)));

    if (!moduleDoc) {
      throw new Error('Requested module not found.')
    }

    if (permissions?.[module]?.list) {
      throw new Error('User does not have permission to export this module');
    }

    const {
      type,
      ids,
      filters,
      sort,
      skip,
      limit,
      columns,
      collectionRef
    } = req.body;

    let col: any = admin
      .firestore()
      .collection(collectionRef || req.url);

    if (filters && filters.length) {
      for (const item of filters) {
        if (
          item.value !== undefined &&
          item.value !== null &&
          item.value !== '' &&
          (
            (
              item.operator === 'array-contains' ||
              item.operator === 'array-contains-any' ||
              item.operator === 'in'
            ) && Array.isArray(item.value) ?
              item.value.length : true
          )
        ) {
          col = col.where(item.key, item.operator, item.value);
        }
      }
    }

    if (sort) {
      col = col.orderBy(
        sort.active,
        sort.direction
      )
    }

    if (skip) {
      col = col.offset(skip);
    }

    if (limit) {
      col = col.limit(limit);
    }

    let docs = (await col.get()).docs.reduce((acc: any[], doc: any) => {
      if (!ids || ids.includes(doc.id)) {
        acc.push({
          ...doc.data(),
          id: doc.id
        });
      }

      return acc;
    }, []);

    if (!docs.length) {
      throw new Error('No data to export');
    }

    let baseColumns: any[];

    if (moduleDoc.layout?.table?.tableColumns) {

      /**
       * Filter authorized columns
       */
      baseColumns = moduleDoc.layout.table.tableColumns.filter((column: any) =>
        column.authorization ? column.authorization.includes(role) : true
      );
    } else {
      baseColumns = Object.keys(moduleDoc.schema.properties || {}).map(key => ({
        key: '/' + key,
        label: key
      }));
    }

    const appliedColumns: any[] = columns ? columns.reduce((acc: any[], cur: any) => {
      const ref = baseColumns.find(it => it.key === cur.key);

      if (!cur.disabled && ref && (!ref.authorization || ref.authorization.includes(role))) {
        acc.push({
          ...ref,
          label: cur.label
        })
      }

      return acc;
    }, []) : baseColumns;

    const getValue = (key: string, doc: any) => {
      if (has(doc, key)) {
        return get(doc, key);
      } else {
        return '';
      }
    };

    if (type !== Type.json) {
      docs = docs.map((doc: any) =>
        appliedColumns.reduce((acc, cur) => {

          if (Array.isArray(cur.key)) {
            acc[cur.label] = cur.key
              .map((key: string) => getValue(key, doc))
              .join(cur.hasOwnProperty('join') ? cur.join : ', ')
          } else {
            acc[cur.label] = getValue(cur.key, doc);
          }

          return acc;
        }, [])
      );
    }

    switch (type) {
      case Type.json:
        return {
          data: JSON.stringify(docs),
          type: 'application/json'
        };

      case Type.xls:
        return {
          data: XLSX.utils.json_to_sheet(docs),
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

      case Type.csv:
      case Type.tab:
      default:
        const json2csvParser = new Parser({
          fields: appliedColumns.map(({label}) => label),
          delimiter: type === Type.csv ? ',' : '  '
        });

        return {
          data: json2csvParser.parse(docs),
          type: 'text/csv'
        };
    }
  }

  exec()
    .then(({type, data}: any) => {
      res.setHeader('Content-type', type);
      return res.send(data);
    })
    .catch(error => {
      functions.logger.error(error);
      res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({error: error.toString()});
    });
});

export const exportData = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onRequest(app);
