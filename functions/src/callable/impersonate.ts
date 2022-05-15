import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {SHARED_CONFIG} from 'definitions';
import {hasRole} from '../utils/auth';

export const impersonate = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    const auth = admin.auth();
    const user = await auth.getUser(data);

    return await auth.createCustomToken(data, user.customClaims)
  });
