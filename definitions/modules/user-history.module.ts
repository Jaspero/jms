import {PipeType} from '../enums/pipe-type.enum';
import {Module} from '../interfaces/module.interface';
import {CREATED_ON} from './shared/created-on';

export const USER_HISTORY_MODULE: Module = {
	id: 'users/{docId}/history',
	name: 'User History',
	layout: {
		filterModule: {
			schema: {
				properties: {
					type: {type: 'string'}
				}
			},
			definitions: {
				type: {
					component: {
						type: 'select',
						configuration: {
							dataSet: [
								{name: 'Create', value: 'create'},
								{name: 'Edit', value: 'edit'},
								{name: 'Delete', value: 'delete'}
							]
						}
					}
				}
			},
			clearFilters: {}
		},
		table: {
			hideAdd: true,
			hideImport: true,
			hideDelete: true,
			hideCheckbox: true,
			tableColumns: [
				CREATED_ON.column(),
				{key: '/type', label: 'Type', pipe: [PipeType.Titlecase]},
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
			type: {type: 'string'},
			...CREATED_ON.property
		}
	}
};