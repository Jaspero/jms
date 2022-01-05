import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const impersonate = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (
      !context.auth ||
      !['admin'].includes(
        context.auth.token.role
      )
    ) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    const auth = admin.auth();

    const user = await auth.getUser(data);

    return await auth.createCustomToken(data, user.customClaims)
  });
