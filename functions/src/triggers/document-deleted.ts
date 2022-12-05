import {Storage} from '@google-cloud/storage';
import {parseTemplate} from '@jaspero/utils';
import {ModuleDeleteCollection, MODULES, ModuleSubCollection, SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import {database} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {dbService} from '../consts/dbService.const';
import {deleteCollection} from '../utils/delete-collection';

export const documentDeleted = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {

    const firestore = admin.firestore();
    const {moduleId, documentId} = context.params;
    const moduleDoc = MODULES.find(item => item.id === moduleId);
    const toExec: Array<Promise<any>> = [];

    if (!moduleDoc) {
      return;
    }

    if (moduleDoc.metadata) {

      const {deletedAuthUser, subCollections, attachedFiles, collections} = moduleDoc.metadata;

      if (attachedFiles) {
        const storage = new Storage().bucket(admin.storage().bucket().name);

        const [files] = await storage.getFiles({
          delimiter: '/',
          ...moduleDoc.metadata?.attachedFiles.prefix && {
            prefix: parseTemplate(moduleDoc.metadata?.attachedFiles.prefix, context.params)
          },
          autoPaginate: true
        });

        toExec.push(
          ...files
            .filter(file =>
              (file.metadata.moduleId === moduleId && file.metadata.documentId === documentId) ||
              file.name.startsWith(`${moduleId}-${documentId}-`)
            )
            .map(
              file =>
                new Promise(resolve =>
                  file
                    .delete()
                    .then(resolve)
                    .catch(error => {
                      functions.logger.error(error);
                      resolve(false);
                    })
                )
            )
        )
      }

      if (deletedAuthUser) {
        toExec.push(
          admin.auth().deleteUser(documentId)
        );
      }

      if (subCollections) {
        subCollections.forEach(
          ({name, batch}: ModuleSubCollection) => {
            toExec.push(
              deleteCollection(
                firestore,
                `${moduleId}/${documentId}/${name}`,
                batch || 100
              )
            );
          }
        );
      }

      if (collections) {
        collections.forEach(
          ({name, filter}: ModuleDeleteCollection) => {

            if (!filter) {
              toExec.push(
                dbService.deleteDocument(name, documentId)
              );
              return;
            }

            const filters = filter(documentId, snap.data());

            if (typeof filters === 'string') {
              toExec.push(
                dbService.deleteDocument(name, filters)
              );
              return;
            }

            const method = async () => {
              let col;
              for (const f of filters) {
                col = await dbService.getDocuments(name, {
                  key: f.key,
                  operator: f.operator,
                  value: f.value
                });
              }

              const docs = col.docs;
              await Promise.all(
                docs.map(doc => dbService.deleteDocument(name, doc.id))
              );
            }

            toExec.push(method())
          }
        )
      }
    }

    if (toExec.length) {
      await Promise.all(toExec);
    }
  });
