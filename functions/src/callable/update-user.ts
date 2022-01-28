import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {hasRole} from '../utils/auth';

export const updateUser = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    hasRole(context, 'admin');

    const ah = auth();
    const {id, ...update} = data;

    if (update.provider) {
      const user = await ah.getUser(id);

      if (update.provider.type === 'provider') {
        update.providerData = user.providerData
          .filter((it: any) => it.providerId !== update.provider.id);
      } else if (user.multiFactor) {
        update.multiFactor = {
          enrolledFactors: user.multiFactor.enrolledFactors
            .filter((it: any) => it.factorId !== update.provider.id)
        };
      }

      delete update.provider;
    }

    try {
      await ah.updateUser(id, update);
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError('internal', e.message);
    }
  });
