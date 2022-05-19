import {exec} from 'child_process';
import {readFileSync} from 'fs';

const {emulators} = JSON.parse(readFileSync('../firebase.json').toString());

[
	['auth', 'FIREBASE_AUTH_EMULATOR_HOST'],
	['firestore', 'FIRESTORE_EMULATOR_HOST'],
	['storage', 'FIREBASE_STORAGE_EMULATOR_HOST'],
]
	.forEach(([key, env]) => {
		if (!emulators[key]) {
			return;
		}

		process.env[env] = `localhost:${emulators[key].port}`;
	});

const proc = exec('npm run dev');

if (proc.stdout) {
	proc.stdout.on('data', console.log);
}
