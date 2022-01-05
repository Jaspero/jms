import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {hasRole} from '../utils/auth';

export const impersonate = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    const auth = admin.auth();
    const user = await auth.getUser(data);

    return await auth.createCustomToken(data, user.customClaims)
  });
