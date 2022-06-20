import {SHARED_CONFIG} from 'definitions';
import * as functions from 'firebase-functions';
import {EmailService} from '../services/email/email.service';

export const sampleEmail = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data: any, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This function must be called while authenticated.'
      );
    }

    const {id, email, data: dynamic} = data;

    await new EmailService().parseEmail(id, dynamic, email);
  });
