import {InstanceSort, Module} from '@definitions';
import {Observable} from 'rxjs';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';

export interface OverviewService {

	getDocuments(
		collection: string,
		pageSize: number,
		filter?: WhereFilter[]
	): Observable<any[]>;

	get(
		module: Module,
		pageSize: number,
		filter?: WhereFilter[],
		search?: string,
		sort?: InstanceSort
	): Observable<any[]>;
}