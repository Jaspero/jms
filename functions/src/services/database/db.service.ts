export class DbService {
	static getDocument(moduleId, id): Promise<any> {
		return Promise.resolve([]);
	}

	static updateDocument(moduleId, id, data): Promise<any> {
		return Promise.resolve([]);
	}

	deleteDocument(moduleId, id): Promise<any> {
		return Promise.resolve([]);
	}

	setDocument(moduleId, id, data, merge = false): Promise<any> {
		return Promise.resolve([]);
	}

	addDocument(moduleId, data): Promise<any> {
		return Promise.resolve([]);
	}

	collectionInstance(name): any {
		return Promise.resolve([]);
	}

	getDocuments(moduleId, data, orderBy?, offset?, limit?): any {
		return Promise.resolve([]);
	}

	deleteCollection(db, collectionPath, batchSize) {
		return Promise.resolve([]);
	}

}
