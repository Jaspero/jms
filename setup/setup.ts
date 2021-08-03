import * as admin from 'firebase-admin';
import {COLLECTIONS} from './collections/collections';

let environment: any = process.argv[2] || 'd';

if (environment === 'd') {
  environment = {
    projectId: 'jaspero-jms'
  };
} else {
  environment = {
    credential: admin.credential.cert('./serviceAccountKey.json'),
    databaseURL: 'https://jaspero-jms.firebaseio.com'
  };
}

admin.initializeApp(environment);

async function exec() {
  const fStore = admin.firestore();

  for (const collection of COLLECTIONS) {
    for (const document of collection.documents) {
      const {id, ...data} = document;

      await fStore.collection(collection.name).doc(id).set(data);
    }
  }
}

exec()
  .then(() => {
    console.log('Setup completely successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
