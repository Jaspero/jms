import {compileRules} from '../rules';
import {scriptSetup} from './script-setup';

declare global {
  interface Window {
    jms: {
      util: any;
    };
  }
}

scriptSetup();

async function exec() {
  await compileRules();
}

exec()
  .then(() => {
    console.log(`Rules updated successfully.`);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });