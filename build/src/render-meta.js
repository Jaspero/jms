const {createDocument} = require('domino');
const {outputFile} = require('fs-extra');
const {minify} = require('html-minifier');
const minifyOptions = {
  minifyCSS: true,
  removeComments: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  minifyJS: true,
  processScripts: ['application/ld+json']
};

module.exports = (async function(delimiter, baseTitle, index, page, path) {
  const document = createDocument(index, true);

  if (page.title) {
    document.title = `${page.title} ${delimiter} ${baseTitle}`;
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
})
