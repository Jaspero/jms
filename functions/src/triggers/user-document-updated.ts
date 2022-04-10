import {SHARED_CONFIG, Collections} from 'definitions';
import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

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
      await ah.setCustomUserClaims(
        change.after.id,
        {
          role: after.role
        }
      )
    }

    if (after.active !== before.active) {
      await ah.updateUser(change.after.id, {disabled: !after.active});
    }
  });

