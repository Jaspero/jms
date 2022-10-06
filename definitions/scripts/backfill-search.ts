import {MODULES} from '../modules/modules';
import {scriptSetup} from './script-setup';
import {deleteDoc, eventExists, getAfter, writeDoc} from 'adv-firestore-functions';

declare global {
  interface Window {
    jms: {
      util: any;
    };
  }
}

const admin = scriptSetup();

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
          };

          if (change.before.exists) {
            const data = change.before.data();

            change.before.data = () => {
              return {
                ...data,
                id: change.before.id
              };
            };
          }

          if (change.after.exists) {
            const data = change.after.data();

            change.after.data = () => {
              return {
                ...data,
                id: change.after.id
              };
            };
          }

          await relevantIndex(change, context, {
            fields: ['id', ...module.spotlight.queryFields],
            searchCol: '_search',
            combinedCol: '_all'
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

/**
 * indexes a collection by relevance
 * @param change
 * @param context
 * @param _opts - {
 *   fields - array of fields to index
 *   searchCol - name of search collection, default _search
 *   numWords - number of words to index at a time, default 6
 *   combine - whether or not to combine fields in one collection, default true
 *   combinedCol - name of combined fields collection, default _all
 *   termField - name of terms array, default _term
 *   filterFunc - function to filter, can pass a soundex function
 * }
 */
export async function relevantIndex(
  change: any,
  context: any,
  _opts: {
    fields: string[];
    searchCol?: string;
    numWords?: number;
    combine?: boolean;
    combinedCol?: string;
    termField?: string;
    filterFunc?: any;
  }
) {
  if (await eventExists(context)) {
    return null;
  }
  const opts = {
    fields: _opts.fields,
    searchCol: _opts.searchCol || '_search',
    numWords: _opts.numWords || 6,
    combine: _opts.combine || true,
    combinedCol: _opts.combinedCol || '_all',
    termField: _opts.termField || '_term',
    filterFunc: _opts.filterFunc
  };
  const colId = context.resource.name.split('/')[5];
  const docId = context.params.docId;
  const searchRef = admin.firestore().doc(`${opts.searchCol}/${colId}/${opts.combinedCol}/${docId}`);

  if (typeof opts.fields === 'string') {
    opts.fields = [opts.fields];
  }

  if (deleteDoc(change)) {
    if (opts.combine) {
      await searchRef.delete();
    } else {
      for (const field of opts.fields) {
        const searchRefF = admin.firestore().doc(`${opts.searchCol}/${colId}/${field}/${docId}`);
        await searchRefF.delete();
      }
    }
  }

  if (writeDoc(change)) {

    const data: any = {};
    let m: any = {};

    for (const field of opts.fields) {

      let fieldValue = getAfter(change, field);

      if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(' ');
      }
      let index = createIndex(fieldValue, opts.numWords);

      if (opts.filterFunc) {
        const temp = [];
        for (const i of index) {
          temp.push(i.split(' ').map((v: string) => opts.filterFunc(v)).join(' '));
        }
        index = temp;
        for (const phrase of index) {
          if (phrase) {
            let v = '';
            const t = phrase.split(' ');
            while (t.length > 0) {
              const r = t.shift();
              v += v ? ' ' + r : r;
              m[v] = m[v] ? m[v] + 1 : 1;
            }
          }
        }
      } else {
        for (const phrase of index) {
          if (phrase) {
            let v = '';
            for (let i = 0; i < phrase.length; i++) {
              v = phrase.slice(0, i + 1);
              m[v] = m[v] ? m[v] + 1 : 1;
            }
          }
        }
      }

      if (!opts.combine) {
        data[opts.termField] = m;
        console.log('Creating relevant index on ', field, ' field for ', colId + '/' + docId);
        const searchRefF = admin.firestore().doc(`${opts.searchCol}/${colId}/${field}/${docId}`);
        await searchRefF.set(data).catch((e: any) => {
          console.log(e);
        });
        m = {};
      }
    }
    if (opts.combine) {
      data[opts.termField] = m;
      console.log('Saving new relevant index for ', colId + '/' + docId);
      await searchRef.set(data).catch((e: any) => {
        console.log(e);
      });
    }
  }
  return null;
}

/**
 * Returns a search array ready to be indexed
 * @param html - to be parsed for indexing
 * @param n - number of words to index
 * @param stringOnly - just return string, default false
 * @returns - array of indexes
 */
function createIndex(html: any, n: number, stringOnly = false): any {
  function beforeReplace(text: any) {
    return text.replace(/&nbsp;/g, ' ').replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, '');
  }

  function createDocs(text: any) {
    const finalArray: any = [];
    const wordArray = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/ +/g, ' ')
      .split(' ');
    if (stringOnly) {
      return wordArray.join(' ');
    }
    do {
      finalArray.push(wordArray.slice(0, n).join(' '));
      wordArray.shift();
    } while (wordArray.length !== 0);
    return finalArray;
  }

  function extractContent(content: any) {
    const htmlToText = require('html-to-text');
    return htmlToText.fromString(content, {
      ignoreHref: true,
      ignoreImage: true
    });
  }

  return createDocs(extractContent(extractContent(beforeReplace(html))));
}
