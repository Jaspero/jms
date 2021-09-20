const {join} = require('path');
const renderMeta = require('./render-meta');

module.exports = (async function(delimiter, baseTitle, basePath, index, pg, doc) {
  const data = {
    id: doc.id,
    ...doc.data()
  };
  const meta = pg.meta(data);
  const metaProperties = await pg.metaProperties(data);
  const title = pg.title(data);
  const id = pg.id(doc).toLowerCase();

  await renderMeta(
    delimiter,
    baseTitle,
    index,
    {
      ...pg,
      meta,
      metaProperties,
      title
    },
    join(basePath, pg.url, id === 'home' ? '/' : id, 'index.html')
  )
})
