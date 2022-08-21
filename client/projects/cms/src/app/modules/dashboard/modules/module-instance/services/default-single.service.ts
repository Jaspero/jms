import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DbService} from '../../../../../shared/services/db/db.service';
import {SingleService} from '../interfaces/single-service.interface';

@Injectable()
export class DefaultSingleService implements SingleService {
	constructor(
		private db: DbService
	) { }
	
	get(moduleId: string, id: string): Observable<any> {
		return this.db.getDocument(moduleId, id);
	}

	save(moduleId: string, id: string, data: any, metadata?: any): Observable<any> {
		return this.db.setDocument(moduleId, id, data, metadata);
	}
}