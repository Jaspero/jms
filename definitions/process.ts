import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {minify} from 'csso';

function pages() {
  const {css} = minify(
    readFileSync(join(__dirname, 'modules/pages/style.css')).toString()
  );

  writeFileSync(
    join(__dirname, 'modules/pages/processed.const.ts'),
    `export const PROCESSED = ${JSON.stringify({css}, null, 2)};`
  )
}

async function exec() {
  pages();
}

exec()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1)
  });