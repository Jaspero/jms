import admin from 'firebase-admin';

admin.initializeApp({projectId: 'jaspero-jms'});

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

	const {blocks, meta, title, globalStyle} = page;
	
	let content = blocks.reduce((acc: string, cur: any) => acc + cur.compiled || '', '');

	if (globalStyle) {
		content += `<style>${globalStyle}</style>`;
	}

	return {
		body: {
			page: {
				content,
				meta,
				title,
			}
		}
	}
}