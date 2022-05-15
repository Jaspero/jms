import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasRole} from '../utils/auth';
import {SHARED_CONFIG} from 'definitions';

export const createUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    let user: admin.auth.UserRecord;

    try {
      user = await admin.auth().createUser(data);
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError('internal', e.message);
    }

    return {
      id: user.uid,
      providerData: user.providerData
    };
  });
