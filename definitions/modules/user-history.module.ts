import {PipeType} from '../enums/pipe-type.enum';
import {Module} from '../interfaces/module.interface';
import {CREATED_ON} from './shared/created-on';

export const USER_HISTORY_MODULE: Module = {
	id: 'users/{docId}/history',
	name: 'User History',
	layout: {
		table: {
			hideAdd: true,
			hideImport: true,
			hideDelete: true,
			hideCheckbox: true,
			tableColumns: [
				CREATED_ON.column(),
				{key: '/before', label: 'Before', pipe: [PipeType.Json]},
				{key: '/after', label: 'After', pipe: [PipeType.Json]},
			]
		}
	},
	schema: {
		properties: {
			id: {type: 'string'},
			before: {type: 'object'},
			after: {type: 'object'},
			...CREATED_ON.property
		}
	}
};