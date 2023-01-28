import {Collections, SHARED_CONFIG} from 'definitions';
import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';
import {schemaValidation} from '../utils/schema-validation';

export const updateEmail = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https.onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'update');
    schemaValidation(
      data,
      {
        additionalProperties: true,
        properties: {
          id: {type: 'string'},
          email: {type: 'string'}
        },
        required: [
          'id',
          'email'
        ]
      }
    );

    const {id, email} = data;

    try {
      await auth().updateUser(id, {email});
      await firestore().collection(Collections.Users).doc(id).update({
        email
      });
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }
  });
