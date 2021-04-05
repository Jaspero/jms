import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {auth} from 'firebase-admin';

export const finishSignUp = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!data.token || !data.password) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Sent invalid parameters.`
      );
    }

    const {uid, email} = await auth().verifyIdToken(data.token);

    await auth().updateUser(uid, {password: data.password});

    return email
  });
