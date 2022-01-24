import {Injectable} from '@angular/core';
import {ref, Storage, uploadBytes} from '@angular/fire/storage';
import {StorageService} from '@jaspero/form-builder';

@Injectable()
export class FbStorageService extends StorageService {
	constructor(
		public storage: Storage
	) {
		super();
	}
	
	upload(path: string, data: any, metadata?: any) {
		return uploadBytes(
			ref(this.storage, path),
			data,
			metadata
		)
	}
}