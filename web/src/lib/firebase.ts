import {fs} from './firebase-admin';

export async function getDocument<T = any>(collection: string, id: string): Promise<T | null> {
	const ref = await fs.collection(collection).doc(id).get();

	if (ref.exists) {
		return ref.data() as T;
	}

	return null;
}

export async function getPage(id: string, collection = 'pages') {
	const page = await getDocument(collection, id);

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

		const elementRegex = /<jpe-([\w-]*)/g;
		const matches = compiled.matchAll(elementRegex);

		for (const match of matches) {
			if (!hasPolyfills) {

				/**
				 * TODO:
				 * Polyfils are loaded here if needed.
				 */

				hasPolyfills = true;
			}

			scripts.push(`/elements/${match[1]}.min.js`);
		}

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