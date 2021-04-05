import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {FirestoreCollection} from '../enums/firestore-collections.enum';
import {EmailService} from '../services/email/email.service';

export const userCreated = functions
  .region(STATIC_CONFIG.cloudRegion)
  .auth
  .user()
  .onCreate(async user => {

    if (!user.email) {
      return;
    }

    const inviteRef = await firestore()
      .collection('user-invites')
      .doc(user.email as string)
      .get();

    const role: {
      role: string;
      email: string;
      requireReset: boolean;
      sendInvite: boolean;
    } = inviteRef.exists ? inviteRef.data() as any : null;

    if (role) {
      await Promise.all([
        auth().setCustomUserClaims(
          user.uid,
          {role: role.role}
        ),
        inviteRef.ref.update({
          accepted: true,
          acceptedOn: Date.now()
        })
      ]);

      if (role.sendInvite) {
         const token = await auth()
          .createCustomToken(user.uid);
         const link = `${STATIC_CONFIG.url}finish-sign-up?t=${token}`;

         await new EmailService().sendEmail({
           to: user.email,
           subject: `Application Invite`,
           html: `
            <p>Please follow the link below to create your account</p>
            <a target="_blank" href="${link}">${link}</a>
           `
         })
      }
    }

    await firestore()
      .collection(FirestoreCollection.Users)
      .doc(user.uid)
      .set({
        createdOn: Date.now(),
        email: user.email,
        ...role ? {
          role: role.role,
          requireReset: role.requireReset || false
        } : {
          role: '',
          requireReset: false
        }
      });
  });
