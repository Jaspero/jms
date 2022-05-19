import {SHARED_CONFIG} from 'definitions';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import {ENV_CONFIG} from '../consts/env-config.const';

interface Status {
  lastPublished: number;
  publishStart: number;
}

export const statusUpdated = functions
  .region(SHARED_CONFIG.cloudRegion)
  .firestore.document(`settings/status`)
  .onUpdate(async change => {
    const after = change.after.data() as Status;
    const before = change.before.data() as Status;

    if (after.publishStart !== before.publishStart && ENV_CONFIG.ghtoken) {
      await fetch(
        `https://api.github.com/repos/${SHARED_CONFIG.github.organization}/${SHARED_CONFIG.github.organization}/actions/workflows/update-web.workflow.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            accept: 'application/vnd.github.v3+json',
            authorization: `bearer ${ENV_CONFIG.ghtoken}`
          },
          body: JSON.stringify({ref: 'build'})
        }
      );
    }
  });
