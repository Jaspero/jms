import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {hasRole} from '../utils/auth';

export const createUser = functions
  .region(STATIC_CONFIG.cloudRegion)
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
