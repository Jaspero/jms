const {readdir, mkdirSync} = require('fs');
const { exec } = require('child_process');
const source = '../definitions';
const dest = 'definitions';
const exclude = ['node_modules'];

try {
	mkdirSync(dest);
} catch (e) {}

readdir(source, (err, files) => {
  files.forEach(file => {
		if (!exclude.some(f => file.startsWith(f))) {
			exec(`cp -r "${source}/${file}" "${dest}/${file}"`);
		}
  });
});