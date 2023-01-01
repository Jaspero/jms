export class DbService {
	getDocument<T = any>(moduleId: string, id: string): Promise<any> {
		return Promise.resolve({});
	}

	updateDocument(moduleId: string, id: string, data): Promise<any> {
		return Promise.resolve([]);
	}

	deleteDocument(moduleId: string, id: string): Promise<any> {
		return Promise.resolve([]);
	}

	setDocument(moduleId: string, id: string, data, merge = false): Promise<any> {
		return Promise.resolve([]);
	}

	addDocument(moduleId: string, data: any): Promise<any> {
		return Promise.resolve([]);
	}

	collectionInstance(name): any {
		return Promise.resolve([]);
	}

	getDocuments(moduleId: string, data, orderBy?, offset?, limit?): any {
		return Promise.resolve([]);
	}

	deleteCollection(db, collectionPath, batchSize) {
		return Promise.resolve([]);
	}
}
