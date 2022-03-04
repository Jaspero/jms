import {relevantIndex} from 'adv-firestore-functions';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {MODULES} from 'definitions';

export const documentWrite = functions
  .region(STATIC_CONFIG.cloudRegion)
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
      };
    }

    if (change.after.exists) {
      const data = change.after.data();

      change.after.data = () => {
        return {
          ...data,
          id: change.after.id
        };
      };
    }

    if (module?.spotlight?.queryFields?.length) {
      await relevantIndex(change, context, {
        fields: ['id', ...module.spotlight.queryFields]
      });
    }
  });
