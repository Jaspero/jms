import {Collections, SHARED_CONFIG} from 'definitions';
import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {hasPermission} from '../utils/auth';

export const updateUser = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    await hasPermission(context, Collections.Users, 'update');

    const ah = auth();
    const {id, ...update} = data;

    if (update.provider) {

      const user = await ah.getUser(id);

      if (update.provider.type === 'provider') {
        const overriderUser = user.toJSON() as any;
        overriderUser.providerData = user.providerData
          .filter((it: any) => it.uid !== update.provider.id);
        await ah.importUsers([overriderUser]);
      } else if (user.multiFactor) {
        update.multiFactor = {
          enrolledFactors: user.multiFactor.enrolledFactors
            .filter((it: any) => it.factorId !== update.provider.id)
        };
      }

      delete update.provider;
    }

    if (!Object.keys(update).length) {
      return;
    }

    try {
      await ah.updateUser(id, update);
    } catch (e) {
      functions.logger.error(e);
      throw new functions.https.HttpsError('internal', e.toString());
    }
  });
