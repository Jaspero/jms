import * as admin from 'firebase-admin';
import {COLLECTIONS} from './collections/collections';

let environemnt: any = process.argv[2] || 'd';

if (environemnt === 'd') {
  environemnt = {
    projectId: 'jaspero-jms'
  };
} else {
  environemnt = {
    serviceAccount: require('./serviceAccountKey.json'),
    databaseURL: 'https://jaspero-jms.firebaseio.com'
  };
}

admin.initializeApp(environemnt);

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


