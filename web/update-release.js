/**
 * Intended for updating release status from firestore
 */
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./key.json'))
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
