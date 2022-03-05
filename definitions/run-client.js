const {execSync, spawn} = require('child_process');
const [command = 'start:cms:live'] = process.argv.slice(2)

console.log(command);

execSync('cd client && npm run rimraf .angular');
const angular = spawn('npm', ['--prefix', '../client', 'run', command]);

angular.stdout.pipe(process.stdout);
angular.stderr.pipe(process.stderr);
process.stdin.pipe(angular.stdin);

process.on('beforeExit', () =>
  angular.kill()
);
