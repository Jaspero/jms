import {Collections, SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';

export const impersonate = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'list');

    const auth = admin.auth();
    const user = await auth.getUser(data);

    return await auth.createCustomToken(data, user.customClaims)
  });
