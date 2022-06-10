import * as admin from 'firebase-admin';
import {SHARED_CONFIG} from '../consts/shared-config.const';

export function scriptSetup() {
	let environment: any = process.argv[2] || 'd';

	if (environment === 'd') {
		environment = {
			projectId: SHARED_CONFIG.projectId
		};
	} else {
		environment = {
			credential: admin.credential.cert('./serviceAccountKey.json'),
			databaseURL: `https://${SHARED_CONFIG.projectId}.firebaseio.com`
		};
	}

	admin.initializeApp(environment);

	return admin;
}
