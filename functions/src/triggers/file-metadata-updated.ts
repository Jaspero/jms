import {SHARED_CONFIG} from 'definitions';
import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {ObjectMetadata} from 'firebase-functions/lib/providers/storage';
import {basename, dirname} from 'path';

export const fileMetadataUpdated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .runWith({
    memory: '1GB',
    timeoutSeconds: 300
  })
  .storage.object()
  .onMetadataUpdate(async ({name, metadata}: ObjectMetadata) => {
    const fileName = basename(name);
    const filePath = dirname(name);

    const driveDocument = await firestore()
      .collection('drive')
      .where('name', '==', fileName)
      .where('path', '==', filePath).get().then(snapshot => {
        if (snapshot.empty) {
          return null;
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
      });

    if (driveDocument) {
      await firestore().collection('drive').doc(driveDocument.id).set({
        metadata
      }, {merge: true});
    }
  });
