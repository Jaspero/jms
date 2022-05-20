import admin from 'firebase-admin';
import {join} from 'path';

admin.initializeApp({
  credential: admin.credential.cert(admin.credential.cert(join(process.cwd(), 'key.json')))
});

async function exec() {
  await admin.firestore().doc('settings/status').set({
    lastPublished: Date.now()
  }, {merge: true})
}

exec()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
