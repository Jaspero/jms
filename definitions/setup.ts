import {scriptSetup} from './scripts/script-setup';
import {COLLECTIONS} from './collections/collections';

declare global {
  interface Window {
    jms: {
      util: any;
    };
  }
}

const admin = scriptSetup();

async function exec() {
  const fStore = admin.firestore();

  for (const collection of COLLECTIONS) {
    for (const document of collection.documents) {
      const {id, ...data} = document;

      const doc = await fStore.collection(collection.name).doc(id).get();

      if (doc.exists && collection.clear) {
        collection.clear(data);
      }

      await doc.ref.set(
        data,
        collection.options || {}
      )
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
