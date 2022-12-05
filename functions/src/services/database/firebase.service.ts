import * as admin from 'firebase-admin';
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
}
