import {SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';

export const storageItemDeleted = functions
	.region(SHARED_CONFIG.cloudRegion)
	.firestore
	.document('storage/{documentId}')
	.onDelete(async (snap) => {

		const storageColl = admin.firestore().collection('storage');
		const storage = new Storage().bucket(admin.storage().bucket().name);
		const item = snap.data();

		if (item.type === 'folder') {
			const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;
			const end = path.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

			const {docs} = await storageColl
				.where('path', '>=', path)
				.where('path', '<', end)
				.get();

			if (docs.length) {
				await Promise.allSettled(
					docs.map(doc => {
						const dt = doc.data();

						if (dt.type === 'file') {
							const filePath = `${dt.path}/${dt.name}`;
							return storage.file(filePath).delete();
						}

						return doc.ref.delete()
					})
				);
			}
		}
	});
