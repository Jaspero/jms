const {execSync, spawn} = require('child_process');


execSync('cd ../client && npm run rimraf .angular');
const angular = spawn('npm', ['--prefix', '../client', 'run', 'start:live']);

angular.stdout.pipe(process.stdout);
angular.stderr.pipe(process.stderr);
process.stdin.pipe(angular.stdin);

process.on('beforeExit', () => {
  angular.kill();
});
