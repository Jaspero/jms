import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {hasRole} from '../utils/auth';

export const updateUser = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    const {id, ...update} = data;

    try {
      await auth().updateUser(id, update);
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError('internal', e.message);
    }
  });
