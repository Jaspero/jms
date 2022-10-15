const {readdir, mkdirSync, cp} = require('fs');
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

	exec(`cp definitions/index.functions.ts definitions/index.ts`);
	exec(`cp definitions/dist/index.functions.d.ts definitions/dist/index.d.ts`);
	exec(`cp definitions/dist/index.functions.js definitions/dist/index.js`);
});