import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {SHARED_CONFIG} from 'definitions';
import {hasRole} from '../utils/auth';

export const getUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');
    return auth().getUser(data);
  });
