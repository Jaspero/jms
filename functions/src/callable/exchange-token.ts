import {Collections, SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {verify} from 'jsonwebtoken';
import {dbService} from '../consts/dbService.const';
import {ENV_CONFIG} from '../consts/env-config.const';


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
        dbService.getDocument(Collections.Users, decoded.id) :
        Promise.resolve()) as any
    ]);

    return {
      token,
      ...user && {user: user.data()}
    }
  })
