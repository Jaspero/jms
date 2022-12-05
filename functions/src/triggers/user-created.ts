import {Collections, EmailTemplates, SHARED_CONFIG} from 'definitions';
import * as functions from 'firebase-functions';
import {dbService} from '../consts/dbService.const';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {EmailService} from '../services/email/email.service';
import {createJwt} from '../utils/create-jwt';

export const userCreated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .auth
  .user()
  .onCreate(async user => {

    if (!user.email) {
      return;
    }

    const inviteRef = await dbService.getDocument(Collections.UserInvites, user.email as string);

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

    await dbService.setDocument(Collections.Users, user.uid, {
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
