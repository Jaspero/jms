import admin from 'firebase-admin';
import * as key from '../../key.json';

let environment: any;

if (environment === 'd') {
  environment = {
    projectId: 'jp-bioinspekt'
  };
} else {
  environment = {
    credential: admin.credential.cert(key as admin.ServiceAccount),
    databaseURL: `https://jp-bioinspekt.firebaseio.com`
  };
}

admin.initializeApp(environment);

export const fs = admin.firestore();
