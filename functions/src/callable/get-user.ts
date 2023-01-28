import {Collections, SHARED_CONFIG} from 'definitions';
import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';

export const getUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'list');
    return auth().getUser(data);
  });
