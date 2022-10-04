import {SHARED_CONFIG} from 'definitions';
import * as functions from 'firebase-functions';
import {EmailService} from '../services/email/email.service';
import {isAuthenticated} from '../utils/auth';
import {schemaValidation} from '../utils/schema-validation';

export const sampleEmail = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data: any, context) => {
    isAuthenticated(context);
    schemaValidation(
      data,
      {
        additionalProperties: false,
        properties: {
          id: {type: 'string'},
          email: {type: 'string'},
          data: {type: 'object'}
        },
        required: [
          'id',
          'email'
        ]
      }
    );

    const {id, email, data: dynamic} = data;

    try {
      await new EmailService().parseEmail(id, dynamic, email);
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }
  });