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

    if (module?.spotlight?.queryFields?.length) {
      await relevantIndex(change, context, {
        fields: module.spotlight.queryFields
      });
    }
  });
