import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {hasRole} from '../utils/auth';

export const updateEmail = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https.onCall(async (data, context) => {
    hasRole(context, 'admin');

    const id = data.id;
    const email = data.email;

    try {
      await auth().updateUser(id, {email});
      await firestore().collection('users').doc(id).update({
        email
      });
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError('internal', e.message);
    }
  });
