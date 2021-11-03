import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

export const userDocumentDeleted = functions
  .region(STATIC_CONFIG.cloudRegion)
  .firestore
  .document(`${FirestoreCollection.Users}/{documentId}`)
  .onDelete(async snap => {
    try {
      await auth().deleteUser(snap.id)
    } catch (e) {}
  });
