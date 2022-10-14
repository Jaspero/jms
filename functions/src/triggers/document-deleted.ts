import {Storage} from '@google-cloud/storage';
import {parseTemplate} from '@jaspero/utils';
import {ModuleDeleteCollection, MODULES, ModuleSubCollection, SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
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
                firestore.collection(name).doc(documentId).delete()
              );
              return;
            }

            const filters = filter(documentId, snap.data());

            if (typeof filters === 'string') {
              toExec.push(
                firestore.collection(name).doc(filters).delete()
              );
              return;
            }

            const method = async () => {
              let col: any = firestore.collection(name);

              for (const f of filters) {
                col = col.where(f.key, f.operator, f.value);
              }

              const {docs} = await col.get();

              await Promise.all(
                docs.map(doc => doc.ref.delete())
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
