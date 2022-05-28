const {execSync} = require('child_process');
const {readdirSync} = require('fs');
const bundle = process.argv[2];

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
const files = readdirSync('./src');

if (bundle) {
  execute(`uglifyjs -o dist/elements.min.js -- ${files.map(file => 'src/' + file).join(' ')}`);
} else {
	files.forEach(file =>
		execute(`uglifyjs -o dist/${file.replace('.js', '.min.js')} -- src/${file}`)
	)
}
