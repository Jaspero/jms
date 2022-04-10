import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {SHARED_CONFIG} from 'definitions';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

export const userDeleted = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onDelete(async user => {
    try {
      await firestore()
        .collection(FirestoreCollection.Users)
        .doc(user.uid)
        .delete();
    } catch (e) {}
  });
