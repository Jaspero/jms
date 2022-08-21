import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import {DYNAMIC_COLLECTIONS} from '../consts/dynamic-collections.const';
import {ENV_CONFIG} from '../consts/env-config.const';
import {STATIC_CONFIG} from '../consts/static-config.const';

export async function updateBuildBranch(collection: string, doc: string) {

  if (!ENV_CONFIG.gh?.token) {
    return;
  }

  const res = await fetch(
    DYNAMIC_COLLECTIONS.deploymentUrl,
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.github.v3+json',
        authorization: `bearer ${ENV_CONFIG.gh?.token}`
      },
      body: JSON.stringify({
        ref: 'build',
        inputs: {
          collection,
          doc,
        }
      })
    }
  );
  console.log(await res.json());
}

export const updateDynamicOnCreate = functions
  .region(STATIC_CONFIG.cloudRegion)
  .firestore
  .document('{moduleId}/{documentId}')
  .onCreate(async (snap, context) => {
    const {moduleId, documentId} = context.params;
    const data = snap.data() as any;

    if (DYNAMIC_COLLECTIONS.collections.hasOwnProperty(moduleId)) {
      // @ts-ignore
      const collection = DYNAMIC_COLLECTIONS.collections[moduleId];

      if (!collection.criteria || collection.criteria(data)) {
        try {
          await updateBuildBranch(moduleId, documentId);
        } catch (e) {
          console.error(e)
        }
      }
    }
  });
