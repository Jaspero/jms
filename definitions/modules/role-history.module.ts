import {PipeType} from '../enums/pipe-type.enum';
import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import {CREATED_ON} from './shared/created-on';

export const ROLE_HISTORY_MODULE: Module = {
	id: Collections.RoleHistory,
	name: 'ROLE_HISTORY',
	layout: {
		sort: CREATED_ON.sort,
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
								{name: 'CREATE', value: 'create'},
								{name: 'EDIT', value: 'edit'},
								{name: 'DELETE', value: 'delete'}
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
			hideEdit: true,
			tableColumns: [
				CREATED_ON.column(),
				{key: '/type', label: 'TYPE', pipe: [PipeType.Titlecase]},
				{
					key: '/before',
					label: 'BEFORE',
					pipe: [PipeType.Json, PipeType.Custom, PipeType.Sanitize],
					pipeArguments: {
						1: (item) => {
							return `<pre style="background-color: #f2f2f2; padding: 5px; border-radius: 4px;">${item}</pre>`
						}
					}
				},
				{
					key: '/after',
					label: 'AFTER',
					pipe: [PipeType.Json, PipeType.Custom, PipeType.Sanitize],
					pipeArguments: {
						1: (item) => {
							return `<pre style="background-color: #f2f2f2; padding: 5px; border-radius: 4px;">${item}</pre>`
						}
					}
				},
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
