import {Storage} from '@google-cloud/storage';
import {basename, dirname} from 'path';
import {scriptSetup} from './script-setup';

const serviceAccount = require('../serviceAccountKey.json');
const admin = scriptSetup();

async function exec() {
  const firestore = admin.firestore();

  /**
   * Remove previous data to avoid duplication
   */
  await firestore.collection('storage').get().then(snapshot => {
    return Promise.all(snapshot.docs.map(doc => doc.ref.delete()));
  });

  const folders = {};

  const storage = new Storage().bucket(`${serviceAccount.project_id}.appspot.com`);
  async function getFile(pageToken?: string) {

    const response = await storage.getFiles({maxResults: 100, pageToken});
    const files = response[0];

    for (const file of files) {
      if (!file) {
        continue;
      }

      const fileName = basename(file.name);
      const dirName = dirname(file.name);

      const storageDocument = {
        name: fileName,
        path: dirName,
        type: file.name.endsWith('/') ? 'folder' : 'file',
        metadata: file.metadata.metadata || {},
        contentType: file.metadata.contentType || '',
        createdOn: new Date(file.metadata.timeCreated).getTime(),
        size: Number(file.metadata.size || 0)
      };

      /**
       * Mimic folder documents since they are not created by Firebase
       */
      const paths = storageDocument.path.split('/');
      for (let i = 0; i < paths.length; i++) {
        const parentPath = paths.slice(0, i + 1).join('/');

        if (!parentPath || parentPath === '.') {
          continue;
        }


        if (!folders[parentPath]) {
          folders[parentPath] = {
            name: paths[i],
            path: paths.slice(0, i).join('/') || '.',
            type: 'folder',
            metadata: {},
            contentType: 'text/plain',
            createdOn: storageDocument.createdOn,
            size: 0
          };
        }

        if (storageDocument.createdOn < folders[parentPath].createdOn) {
          folders[parentPath].createdOn = storageDocument.createdOn;
        }
      }

      await firestore.collection('storage').add(storageDocument);
    }

    if (!(response[1] as any)?.pageToken) {
      console.log('No more files.');
    } else {
      await getFile((response[1] as any).pageToken);
    }
  }

  await getFile();

  for (const [_, folder] of Object.entries(folders)) {
    await firestore.collection('storage').add(folder);
  }
}

exec()
  .then(() => {
    console.log('Backfill Storage completely successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
