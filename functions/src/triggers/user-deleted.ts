import {Collections, SHARED_CONFIG} from 'definitions';
import * as functions from 'firebase-functions';
import {dbService} from '../consts/dbService.const';

export const userDeleted = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onDelete(async user => {
    try {
      await dbService.deleteDocument(Collections.Users, user.uid);
    } catch (e) { }
  });
