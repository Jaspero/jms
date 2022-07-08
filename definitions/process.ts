import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {minify} from 'csso';

/**
 * Various pre-processing for modules
 */

function automaticEmails() {
  const layout = readFileSync(join(__dirname, 'modules/emails/layout.html')).toString();

  /**
   * Add any new segments here
   */
  const segments = [
    'section'
  ]
    .reduce((acc, cur) => {
      acc[cur] = readFileSync(join(__dirname, 'modules/emails/' + cur + '.segment.html')).toString();
      return acc;
    }, {});

  const {css} = minify(
    readFileSync(join(__dirname, 'modules/emails/style.css')).toString()
  );

  writeFileSync(
    join(__dirname, 'modules/emails/processed.const.ts'),
    `export const PROCESSED = ${JSON.stringify({layout, segments, css}, null, 2)};`
  )
}

async function exec() {
  automaticEmails();
}

exec()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1)
  });
