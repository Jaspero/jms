import {Collections, SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';
import {schemaValidation} from '../utils/schema-validation';

export const createUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'create');
    schemaValidation(
      data,
      {
        additionalProperties: false,
        properties: {
          email: {type: 'string'},
          password: {
            type: 'string',
            minLength: 6
          }
        },
        required: [
          'email',
          'password'
        ]
      }
    );

    let user: admin.auth.UserRecord;

    try {
      user = await admin.auth().createUser(data);
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return {
      id: user.uid,
      providerData: user.providerData
    };
  });
