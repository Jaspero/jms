const {join} = require('path');
const {readFileSync} = require('fs');
const admin = require('firebase-admin');
const renderDocument = require('./src/render-document');
const renderMeta = require('./src/render-meta');
const siteMap = require('./src/site-map');
const URL = 'https://jaspero-jms.web.app/';
const BASE_PATH = join(__dirname, '..', 'public/web');
const BASE_TITLE = 'JMS';
const DELIMITER = '-';
const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/jaspero-automated-tests.appspot.com/o/';
const PAGES = [
  {
    url: '',
    collection: 'pages',
    id: doc => doc.id,
    title: item => item.meta?.title || item.title,
    meta: item => ({
      description: item.meta?.description || ''
    }),
    metaProperties: async item => {

      if (!item.meta) {
        return {};
      }

      const thumb = item.meta.image ? `${BASE_URL}generated%2Fthumb_m_${item.meta.image.split(BASE_URL)[1]}` : `${URL}/assets/img/logo.png`;
      const description = item.meta.description;
      return {
        ['og:type']: 'article',
        ['og:url']: `${URL}/${item.id}`,
        ['og:title']: item.meta.title,
        ['og:description']: description,
        ['og:image']: thumb,
        ['twitter:card']: 'summary_large_image',
        ['twitter:url']: `${URL}/${item.id}`,
        ['twitter:title']: item.meta.title,
        ['twitter:description']: description,
        ['twitter:image']: thumb
      }
    }
  }
];

async function createPages(collection, id) {

  const index = readFileSync(join(BASE_PATH, 'index.html')).toString();
  admin.initializeApp({
    credential: admin.credential.cert(require('./account.json'))
  });

  const fStore = admin.firestore();

  if (collection && id) {
    const pg = PAGES.find(p => p.collection === collection);
    const doc = await fStore.collection(pg.collection).doc(id).get();
    await renderDocument(DELIMITER, BASE_TITLE, BASE_PATH, index, pg, doc);
    return;
  }

  const sitemapPages = [];

  await Promise.all(
    PAGES.map(async pg => {
      if (pg.collection) {
        const docs = await (pg.criteria ? pg.criteria(fStore.collection(pg.collection)) : fStore.collection(pg.collection)).get();

        await Promise.all(
          docs.docs.map(async doc => {
            sitemapPages.push({
              url: `${URL}${pg.url.replace(/^\//, '')}/${pg.id(doc)}`
            });
            await renderDocument(DELIMITER, BASE_TITLE, BASE_PATH, index, pg, doc);
          })
        )
      } else {
        sitemapPages.push({
          url: `${URL}${pg.url.replace(/^\//, '')}`
        });
        await renderMeta(
          index,
          pg,
          join(BASE_PATH, pg.url + '.html')
        )
      }
    })
  );

  await siteMap(BASE_PATH, sitemapPages);
}

createPages(process.argv[3] || '', process.argv[4] || '')
  .then(() => process.exit())
  .catch(e => {
    console.error(e);
    process.exit(1)
  });
