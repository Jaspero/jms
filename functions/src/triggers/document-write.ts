import {relevantIndex} from 'adv-firestore-functions';
import * as functions from 'firebase-functions';
import {MODULES, SHARED_CONFIG, Collections} from 'definitions';
import {random} from '@jaspero/utils';

export const documentWrite = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore
  .document(`{colId}/{docId}`)
  .onWrite(async (change, context) => {
    const module = MODULES.find(item => item.id === context.params.colId);

    if (change.before.exists) {
      const data = change.before.data();

      change.before.data = () => {
        return {
          ...data,
          id: change.before.id
        };
      }
    }

    if (change.after.exists) {
      const data = change.after.data();

      change.after.data = () => {
        return {
          ...data,
          id: change.after.id
        };
      }
    }

    if (module?.metadata?.history) {

      /**
       * TODO:
       * This is the same method for generating the id
       * on save. We should fine a way to re-use it.
       */
      const historyId = 'hi-' + (
        module.metadata.docIdMethod ?
          module.metadata.docIdMethod(change.after) :
          `${module.metadata?.docIdPrefix || module.id.slice(0, 2)}-${random.string(module.metadata?.docIdSize || 12)}`
      )

      await change.after.ref.collection(Collections.History).doc(historyId).set({
        type: change.before.exists ? (change.after.exists ? 'update' : 'delete') : 'create',
        createdOn: Date.now(),
        ...change.before.exists && {before: change.before.data()},
        ...change.after.exists && {after: change.after.data()}
      });
    }

    if (module?.spotlight?.queryFields?.length) {
      await relevantIndex(change, context, {
        fields: ['id', ...module.spotlight.queryFields]
      });
    }
  });
