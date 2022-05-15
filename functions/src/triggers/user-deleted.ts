import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {SHARED_CONFIG, Collections} from 'definitions';

export const userDeleted = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onDelete(async user => {
    try {
      await firestore()
        .collection(Collections.Users)
        .doc(user.uid)
        .delete();
    } catch (e) {}
  });
