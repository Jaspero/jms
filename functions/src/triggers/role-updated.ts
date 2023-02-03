import {Collections, SHARED_CONFIG, compileRules} from 'definitions';
import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';

export const roleUpdated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore
  .document(`${Collections.Roles}/{documentId}`)
  .onUpdate(async change => {
    const after: any = change.after.data();
    const before: any = change.before.data();
    const fs = firestore();
    const keys = ['get', 'list', 'create', 'update', 'delete'];
    const permissionsKeys = new Set<string>();

    for (const key of Object.keys(after.permissions || {})) {
      permissionsKeys.add(key);
    }

    for (const key of Object.keys(before.permissions || {})) {
      permissionsKeys.add(key);
    }

		const diff = Array.from(permissionsKeys).some((key) => {
			if (before[key] === undefined) {
				return true;
			}

			for (const k of keys) {
				if (after.permissions?.[key]?.[k] !== before?.permissions?.[key]?.[k]) {
					return true;
				}
			}

			return false;
		});

    if (diff) {
      const {docs} = await fs.collection(Collections.Users)
        .where('role', '==', change.after.id)
        .get();

      await Promise.allSettled(
        docs.map(doc =>
          doc.ref.collection('authorization').doc('permissions').set(after.permissions)
        )
      );
    }

    await compileRules();
  });

