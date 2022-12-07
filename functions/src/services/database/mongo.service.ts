import {DbService} from './db.service';
import fetch from 'node-fetch';
export class MongoDbService extends DbService {

	getDocument(moduleId, id): Promise<any> {
		fetch(`/api/document/${moduleId}/${id}`, {
			method: 'GET',
		})
	}

	updateDocument(moduleId, id, data): Promise<any> {
		fetch(`/api/document/${moduleId}/?field=${id}`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	deleteDocument(moduleId, id): Promise<any> {
		fetch(`/api/document/${moduleId}/${id}`, {
			method: 'DELETE',
		})
	}

	setDocument(moduleId, id, data, merge = false): Promise<any> {
		fetch(`/api/document/${moduleId}/`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	addDocument(moduleId, data): Promise<any> {
		fetch(`/api/document/${moduleId}/`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	getDocuments(moduleId, data, orderBy?, offset?, limit?) {
	}
	deleteCollection(db, collectionPath, batchSize): Promise<any> {
	}

}
