import admin from 'firebase-admin';
import {join} from 'path';
import {ELEMENTS} from './consts/elements.const';

let environment: any;

if (environment === 'd') {
	environment = {
		projectId: 'jaspero-jms'
	};
} else {
	environment = {
		credential: admin.credential.cert(join(process.cwd(), 'key.json')),
		databaseURL: `https://jaspero-jms.firebaseio.com`
	};
}

admin.initializeApp(environment);

const fs = admin.firestore();

export async function getDocument<T = any>(collection: string, id: string): Promise<T | null> {
	const ref = await fs.collection(collection).doc(id).get();

	if (ref.exists) {
		return ref.data() as T;
	}

	return null;
}

export async function getPage(id: string) {
	const page = await getDocument('pages', id);

	if (!page || !page.active) {
		return {
			status: 404
		}
	}

	const {blocks, meta, title, globalStyles} = page;
	const scripts: string[] = [];
	
	let content = blocks.reduce((acc: string, cur: any) => {

		const {compiled = ''} = cur;

		let hasPolyfills = false;

		ELEMENTS.forEach(element => {
			if (compiled.includes(element.selector)) {
				if (!hasPolyfills) {

					scripts.push(
						`/elements/${element.script}/runtime.js`
					);

					hasPolyfills = true;
				}

				scripts.push(`/elements/${element.script}/main.js`);
			}
		})

		return acc + compiled;
	}, '');

	if (globalStyles) {
		content += `<style>${globalStyles}</style>`;
	}

	return {
		body: {
			page: {
				id,
				content,
				meta,
				title,
				scripts
			}
		}
	}
}