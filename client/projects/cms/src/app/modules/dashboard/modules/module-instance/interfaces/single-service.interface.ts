import {Observable} from 'rxjs';

export interface SingleService {
	get(moduleId: string, id: string): Observable<any>;
	save(moduleId: string, id: string, data: any, metadata?: any): Observable<any>;
}