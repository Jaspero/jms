import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

export const userCreated = functions
  .region(STATIC_CONFIG.cloudRegion)
  .auth
  .user()
  .onCreate(async user => {
    const inviteRef = await firestore()
      .collection('user-invites')
      .doc(user.email)
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
