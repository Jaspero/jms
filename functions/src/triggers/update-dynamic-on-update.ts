import * as functions from 'firebase-functions';
import {DYNAMIC_COLLECTIONS} from '../consts/dynamic-collections.const';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {updateBuildBranch} from './update-dynamic-on-create';

export const updateDynamicOnUpdate = functions
  .region(STATIC_CONFIG.cloudRegion)
  .firestore
  .document('{moduleId}/{documentId}')
  .onUpdate(async (snap, context) => {
    const {moduleId, documentId} = context.params;
    const newValue = snap.after.data() as any;
    const previousValue = snap.before.data() as any;

    if (DYNAMIC_COLLECTIONS.collections.hasOwnProperty(moduleId)) {
      // @ts-ignore
      const collection = DYNAMIC_COLLECTIONS.collections[moduleId];
      const changed = collection.changes.some((key: string) => JSON.stringify(newValue[key]) !== JSON.stringify(previousValue[key]));

      if (changed) {
        if (!collection.criteria || collection.criteria(newValue)) {
          try {
            await updateBuildBranch(moduleId, documentId);
          } catch (e) {
            console.error(e)
          }
        } else if (collection?.criteria(newValue) !== collection?.criteria(previousValue)) {
          // TODO: Implement document removal
        }
      }
    }
  });
