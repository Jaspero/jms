import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {SHARED_CONFIG} from 'definitions';
import {hasRole} from '../utils/auth';

export const removeUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    try {
      await auth().deleteUser(data.id);
    } catch (e) {
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return true;
  });
