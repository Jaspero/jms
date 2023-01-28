import {Collections, SHARED_CONFIG} from 'definitions';
import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';
import {schemaValidation} from '../utils/schema-validation';

export const removeUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'delete');
    schemaValidation(
      data,
      {
        additionalProperties: false,
        properties: {
          id: {type: 'string'}
        },
        required: ['id']
      }
    );

    try {
      await auth().deleteUser(data.id);
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return true;
  });
