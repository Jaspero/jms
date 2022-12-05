import * as admin from 'firebase-admin';
import {DbService} from './db.service';
export abstract class FirebaseDatabaseService extends DbService {

	getDocument(moduleId, id): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).get();
	}

	updateDocument(moduleId, id, data): Promise<any> {
		return admin.firestore().collection(moduleId).doc(id).update(data);
	}

}
