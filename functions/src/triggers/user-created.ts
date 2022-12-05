import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {EmailService} from '../services/email/email.service';
import {createJwt} from '../utils/create-jwt';
import {SHARED_CONFIG, Collections, EmailTemplates} from 'definitions';
import {dbService} from '../consts/dbService.const';

export const userCreated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onCreate(async user => {

    if (!user.email) {
      return;
    }

    const inviteRef = await dbService.getDocument(Collections.UserInvites, user.email as string);
    const userRef = await dbService.getDocument(Collections.Users, user.uid);

    const role: {
      role: string;
      email: string;
      requireReset: boolean;
      sendInvite: boolean;
      createdBy?: string;
    } = inviteRef.exists ? inviteRef.data() as any : null;

    if (role) {

      const roleRef = await dbService.getDocument(Collections.Roles, role.role);

      await Promise.all([
        dbService.setDocument('authorization', 'permissions', roleRef.data()?.permissions || {}),
        dbService.updateDocument(Collections.UserInvites, user.email, {
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
