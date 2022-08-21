import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {EmailService} from '../services/email/email.service';

export const formSubmissionCreated = functions.firestore
  .document(`forms/{documentId}/submissions/{userId}`)
  .onCreate(async (snap, context) => {
    const data = snap.data() as any;
    const emailService = new EmailService();

    if (data.emailId) {
      const sentEmail = await emailService.parseEmail(data.emailId, data);

      if (sentEmail) {
        await snap.ref.update({
          sentEmails: firestore.FieldValue.arrayUnion(sentEmail)
        })
      }
    }
  });
