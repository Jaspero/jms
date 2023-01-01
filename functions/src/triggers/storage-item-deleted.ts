import {SHARED_CONFIG} from 'definitions';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
import {dbService} from '../consts/dbService.const';

export const storageItemDeleted = functions
	.region(SHARED_CONFIG.cloudRegion)
	.firestore
	.document('storage/{documentId}')
	.onDelete(async (snap) => {
		const storage = new Storage().bucket(admin.storage().bucket().name);
		const item = snap.data();

		if (item.type === 'folder') {
			const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;
			const end = path.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

			const {docs} = await dbService.getDocuments('storage', [
				{
					field: 'path',
					operator: '>=',
					value: path
				},
				{
					field: 'path',
					operator: '<',
					value: end
				}
			]);

			if (docs.length) {
				const results = await Promise.allSettled(
					docs.map(doc => {
						const dt = doc.data();

						if (dt.type === 'file') {
							const filePath = `${dt.path}/${dt.name}`;
							return storage.file(filePath).delete();
						}

						return dbService.deleteDocument('storage', doc.id);
					})
				);

				console.log(results);
			}
		}
	});
