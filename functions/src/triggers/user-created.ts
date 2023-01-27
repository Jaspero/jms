import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {EmailService} from '../services/email/email.service';
import {createJwt} from '../utils/create-jwt';
import {SHARED_CONFIG, Collections, EmailTemplates} from 'definitions';

export const userCreated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onCreate(async user => {

    if (!user.email) {
      return;
    }

    const fs = firestore();
    const ah = auth();

    const inviteRef = await fs
      .collection(Collections.UserInvites)
      .doc(user.email as string)
      .get();
    const userRef = fs
      .collection(Collections.Users)
      .doc(user.uid);

    const role: {
      role: string;
      email: string;
      requireReset: boolean;
      sendInvite: boolean;
      createdBy?: string;
    } = inviteRef.exists ? inviteRef.data() as any : null;

    if (role) {

      const roleRef = await fs.collection(Collections.Roles).doc(role.role).get();

      await Promise.all([
        ah.setCustomUserClaims(
          userRef.id,
          {role: role.role}
        ),
        userRef
          .collection('authorization')
          .doc('permissions')
          .set(roleRef.data()?.permissions || {}),
        inviteRef
          .ref
          .update({
            accepted: true,
            acceptedOn: Date.now()
          })
      ]);

      if (role.sendInvite) {
        const token = await createJwt({id: user.uid});
        const link = `${STATIC_CONFIG.url}finish-sign-up?t=${token}`;

        await new EmailService().parseEmail(EmailTemplates.UserSignUpInvite, {
          link,
          email: user.email,
          role: role.role
        }, user.email);
      }
    }

    await userRef
      .set({
        createdOn: Date.now(),
        email: user.email,
        active: true,
        ...role ? {
          role: role.role,
          requireReset: role.requireReset || false,
          ...role.createdBy && {invitedBy: role.createdBy}
        } : {
          role: '',
          requireReset: false
        }
      });
  });
