import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteCollection} from '../utils/delete-collection';
import {MODULES, SHARED_CONFIG} from 'definitions';
import {parseTemplate} from '@jaspero/utils';

export const documentDeleted = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {
    const {moduleId, documentId} = context.params;
    const moduleDoc = MODULES.find(item => item.id === moduleId);

    if (!moduleDoc || !moduleDoc.metadata?.attachedFiles?.containes) {
      return;
    }

    const storage = new Storage().bucket(admin.storage().bucket().name);
    const firestore = admin.firestore();

    const [files] = await storage.getFiles({
      delimiter: '/',
      ...moduleDoc.metadata?.attachedFiles.prefix && {
        prefix: parseTemplate(moduleDoc.metadata?.attachedFiles.prefix, context.params)
      },
      autoPaginate: true
    });

    const toExec: Array<Promise<any>> = files
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
                console.error(error);
                resolve(false);
              })
          )
      );

      if (moduleDoc.metadata) {

        const {deletedAuthUser, subCollections} = moduleDoc.metadata;

        if (deletedAuthUser) {
          toExec.push(
            admin.auth().deleteUser(documentId)
          )
        }

        if (subCollections) {
          subCollections.forEach(
            ({name, batch}: {name: string; batch?: number}) => {
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
      }

    if (toExec.length) {
      await Promise.all(toExec);
    }
  });
