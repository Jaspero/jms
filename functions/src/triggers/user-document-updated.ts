import {Collections, SHARED_CONFIG} from 'definitions';
import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';

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
    const fs = firestore();

    if (after.role !== before.role) {

      const roleRef = await fs.collection(Collections.Roles).doc(after.role).get();

      await ah.setCustomUserClaims(
        change.after.id,
        {
          permissions: roleRef.data()?.permissions || {},
          role: after.role
        }
      )
    }

    if (after.active !== before.active) {
      await ah.updateUser(change.after.id, {disabled: !after.active});
    }
  });

