const {execSync} = require('child_process');
const {readdirSync} = require('fs');

function execute(commnand) {
  try {
    const stdout = execSync(commnand);
    return stdout.toString();
  } catch (error) {
    throw error.stdout.toString();
  }
}

/**
 * Clear folder
 */
execute('rm -rf dist && mkdir dist');

/**
 * Compile files
 */
readdirSync('./src').forEach(file => execute(`uglifyjs -o dist/${file.replace('.js', '.min.js')} -- src/${file}`));
