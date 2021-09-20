const {outputFile} = require('fs-extra');
const toW3CString = require('./w3');

module.exports = function (parsed) {
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
