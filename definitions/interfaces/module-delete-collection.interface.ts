import {WhereFilter} from '@jaspero/form-builder';

export interface ModuleDeleteCollection {
	name: string;
  filter?: (id: string, data: any) => WhereFilter[] | string;
}