const {createDocument} = require('domino');
const {join} = require('path');
const {readFileSync} = require('fs');
const {outputFile} = require('fs-extra');
const {minify} = require('html-minifier');
const admin = require('firebase-admin');
const minifyOptions = {
  minifyCSS: true,
  removeComments: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  minifyJS: true,
  processScripts: ['application/ld+json']
};

const URL = 'https://jaspero-jms.web.app/';
const BASE_PATH = join(__dirname, '..', 'dist/wev');
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

function stripHtml(data) {
  return (data || '').replace(/(<([^>]+)>)/ig,'')
}

function toW3CString(date = new Date()) {
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const offset = -date.getTimezoneOffset();
  let offsetHours = Math.abs(Math.floor(offset / 60));
  let offsetMinutes = Math.abs(offset) - offsetHours * 60;
  let offsetSign = '+';

  month++;

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  if (hours < 10) {
    hours = '0' + hours;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (offsetHours < 10) {
    offsetHours = '0' + offsetHours;
  }

  if (offsetMinutes < 10) {
    offsetMinutes = '0' + offsetMinutes;
  }

  if (offset < 0) {
    offsetSign = '-';
  }

  return (
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    offsetSign +
    offsetHours +
    ':' +
    offsetMinutes
  );
}

function siteMap(parsed) {
  const lastMod = toW3CString();
  let final = `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  parsed.forEach(route => {
    final += `<url>
    <loc>${route.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority || '0.8'}</priority>
</url>`
  });

  final += '</urlset>';

  return outputFile(
    join(BASE_PATH, 'sitemap.xml'),
    final
  )
}

async function renderMeta(index, page, path) {
  const document = createDocument(index, true);

  if (page.title) {
    document.title = `${page.title} ${DELIMITER} ${BASE_TITLE}`;
  }

  if (page.meta) {
    Object.entries(page.meta).forEach(([key, value]) => {
      document.querySelector(`meta[name=${key}]`)['content'] = value;
    });
  }

  if (page.metaProperties) {
    Object.entries(page.metaProperties).forEach(([key, value]) => {
      if (document.querySelector(`meta[property=${key}]`)) {
        document.querySelector(`meta[property=${key}]`)['content'] = value;
      }
    });
  }

  return outputFile(
    path,
    minify(
      '<!doctype html>' + document.documentElement.outerHTML,
      minifyOptions
    )
  )
}

async function renderDocument(index, pg, doc) {
  const data = {
    id: doc.id,
    ...doc.data()
  };
  const meta = pg.meta(data);
  const metaProperties = await pg.metaProperties(data);
  const title = pg.title(data);

  await renderMeta(
    index,
    {
      ...pg,
      meta,
      metaProperties,
      title
    },
    join(BASE_PATH, pg.url, pg.id(doc), 'index.html')
  )
}

async function createPages(collection, id) {

  const index = readFileSync(join(BASE_PATH, 'index.html')).toString();
  admin.initializeApp({
    credential: admin.credential.cert(require('./account.json'))
  });

  const fStore = admin.firestore();

  if (collection && id) {
    const pg = PAGES.find(p => p.collection === collection);
    const doc = await fStore.collection(pg.collection).doc(id).get();
    await renderDocument(index, pg, doc);
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
              url: `${URL}/${pg.url}/${pg.id(doc)}`
            });
            await renderDocument(index, pg, doc);
          })
        )
      } else {
        sitemapPages.push({
          url: `${URL}/${pg.url}`
        });
        await renderMeta(
          index,
          pg,
          join(BASE_PATH, pg.url + '.html')
        )
      }
    })
  )

  await siteMap(sitemapPages);
}

createPages(process.argv[3] || '', process.argv[4] || '')
  .then(() => process.exit())
  .catch(e => {
    console.error(e);
    process.exit(1)
  });
