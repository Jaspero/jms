const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./account.json')),
  databaseURL: process.argv[2]
});

async function exec() {
  await admin.firestore().doc('settings/version').set({version: admin.firestore.FieldValue.increment(1)}, {merge: true});
}

exec()
  .then(() => {
    console.log('data updated successfully');
    process.exit();
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
