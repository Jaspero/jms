import * as admin from 'firebase-admin';
import {deleteCollection} from '../../utils/delete-collection';
import {DbService} from './db.service';
export class FirebaseDatabaseService extends DbService {

	getDocument(moduleId, id): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).get();
	}

	updateDocument(moduleId, id, data): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).update(data);
	}

	deleteDocument(moduleId, id): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).delete();
	}

	setDocument(moduleId, id, data, merge = false): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).set(data, {merge});
	}

	addDocument(moduleId, data): Promise<any> {
		return admin.firestore().collection(moduleId).add(data);
	}

	getDocuments(moduleId, data, orderBy?, offset?, limit?) {
		const coll = admin.firestore().collection(moduleId)

		data.forEach((item) => {
			coll.where(item.key, item.operator, item.value);
		})

		if (orderBy && orderBy.active) {
			coll.orderBy(orderBy.active, orderBy.direction)
		}

		if (offset) {
			coll.offset(offset);
		}

		if (limit) {
			coll.limit(limit);
		}

		return coll.get()

	}
	deleteCollection(db, collectionPath, batchSize): Promise<any> {
		return deleteCollection(db, collectionPath, batchSize)
	}

}
