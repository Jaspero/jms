import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {verify} from 'jsonwebtoken';
import {ENV_CONFIG} from '../consts/env-config.const';
import {SHARED_CONFIG, Collections} from 'definitions';

export const exchangeToken = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https.onCall(async data => {

    let decoded: {id: string};

    try {
      decoded = verify(data.token, ENV_CONFIG.esecret) as any;
    } catch (e) {
      throw new functions.https.HttpsError('unauthenticated', 'Token invalid');
    }
    const firestore = admin.firestore();
    const auth = admin.auth();

    const [token, user] = await Promise.all([
      auth.createCustomToken(decoded.id),
      (data.pullUser !== false ?
        firestore.collection(Collections.Users).doc(decoded.id).get() :
        Promise.resolve()) as any
    ]);

    return {
      token,
      ...user && {user: user.data()}
    }
  })
