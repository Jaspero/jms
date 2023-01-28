import {Collections, SHARED_CONFIG} from 'definitions';
import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {EmailService} from '../services/email/email.service';
import {hasPermission} from '../utils/auth';
import {schemaValidation} from '../utils/schema-validation';

export const triggerPasswordReset = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'update');
    schemaValidation(
      data,
      {
        additionalProperties: false,
        properties: {
          email: {type: 'string'},
          url: {type: 'string'}
        },
        required: [
          'email',
          'url'
        ]
      }
    );

    let link;

    try {
      link = await auth().generatePasswordResetLink(data.email, {url: data.url});

      await new EmailService().sendEmail({
        subject: 'Reset Password',
        html: `
          <p>Follow the link below to reset your password.</p>
          <a href="${link}" target="_blank">${link}</a>
        `,
        to: data.email
      });
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return {
      link
    };
  });
