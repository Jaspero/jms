import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {SHARED_CONFIG} from 'definitions';
import {EmailService} from '../services/email/email.service';
import {hasRole} from '../utils/auth';

export const triggerPasswordReset = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

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
      console.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return {
      link
    };
  });
