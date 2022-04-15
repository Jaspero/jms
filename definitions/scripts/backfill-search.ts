import {relevantIndex} from 'adv-firestore-functions';
import * as admin from 'firebase-admin';
import {MODULES} from '../modules/modules';

declare global {
  interface Window {
    jms: {
      util: any;
    };
  }
}

let environment: any = process.argv[2] || 'd';

if (environment === 'd') {
  environment = {
    projectId: 'jaspero-jms'
  };
} else {
  environment = {
    credential: admin.credential.cert('../serviceAccountKey.json'),
    databaseURL: 'https://jaspero-jms.firebaseio.com'
  };
}

admin.initializeApp(environment);

async function exec() {
  const firestore = admin.firestore();

  const modules = MODULES.filter(item => item?.spotlight?.queryFields?.length);

  for (const module of modules) {
    await new Promise<void>((resolve) => {
      let counter = 0;
      let startAfter = null;

      function fetchDocument() {
        return firestore.collection(module.id).orderBy(module.spotlight.queryFields[0]).limit(1).startAfter(startAfter).get().then(async (snap) => {
          counter++;
          if (!snap.docs.length) {
            return resolve();
          }

          startAfter = snap.docs[0];

          const context: any = {
            resource: {
              name: `/////${module.id}`
            },
            params: {
              docId: snap.docs[0].id
            }
          };

          const change = {
            before: snap.docs[0],
            after: snap.docs[0]
          }

          if (change.before.exists) {
            const data = change.before.data();

            change.before.data = () => {
              return {
                ...data,
                id: change.before.id
              };
            }
          }

          if (change.after.exists) {
            const data = change.after.data();

            change.after.data = () => {
              return {
                ...data,
                id: change.after.id
              };
            }
          }

          await relevantIndex(change, context, {
            fields: ['id', ...module.spotlight.queryFields]
          });

          return fetchDocument();
        });
      }

      return fetchDocument();
    });
  }
}

exec()
  .then(() => {
    console.log('Backfill Search completely successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
