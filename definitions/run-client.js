const {execSync, spawn} = require('child_process');
const [command = 'start:cms:live'] = process.argv.slice(2);

execSync('npm run --prefix "../client" rimraf -- ".angular"');
const angular = spawn('npm', ['--prefix', '../client', 'run', command], {shell: true});

angular.stdout.pipe(process.stdout);
angular.stderr.pipe(process.stderr);
process.stdin.pipe(angular.stdin);

process.on('beforeExit', () =>
  angular.kill()
);
