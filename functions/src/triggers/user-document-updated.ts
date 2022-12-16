import {Collections, SHARED_CONFIG} from 'definitions';
import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {dbService} from '../consts/dbService.const';

/**
 * Updates users custom claims when
 * the users role changes in firestore
 */
export const userDocumentUpdated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore
  .document(`${Collections.Users}/{documentId}`)
  .onUpdate(async change => {
    const after: any = change.after.data();
    const before: any = change.before.data();
    const ah = auth();

    if (after.role !== before.role) {

      const roleRef = await dbService.getDocument(Collections.Roles, after.role);

      await Promise.all([
        ah.setCustomUserClaims(
          change.after.id,
          {role: after.role}
        ),
        dbService.updateDocument('authorization', 'permissions', roleRef.data()?.permissions || {}),
      ])
    }

    if (after.active !== before.active) {
      await ah.updateUser(change.after.id, {disabled: !after.active});
    }
  });

