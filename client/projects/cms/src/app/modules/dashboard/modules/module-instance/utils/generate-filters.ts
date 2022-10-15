import {FilterMethod, Module} from '@definitions';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';

export function generateFilters(
	module: Module,
	search: string,
	filter: WhereFilter[]
) {
	return search && search.trim() ?
		[{
			key: module.layout.searchModule.key,
			operator: module.layout.searchModule.simple ? FilterMethod.Equal : FilterMethod.ArrayContains,
			value: search.trim().toLowerCase()
		}] :
		filter;
}