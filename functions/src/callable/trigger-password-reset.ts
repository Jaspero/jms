import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {EmailService} from '../services/email/email.service';

export const triggerPasswordReset = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

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
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return {
      link
    };
  });
