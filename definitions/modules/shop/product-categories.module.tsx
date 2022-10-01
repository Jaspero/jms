import {Collections} from '../../interfaces/collections';
import {Module} from '../../interfaces/module.interface';
import {CREATED_ON} from '../shared/created-on';

export const PRODUCT_CATEGORIES_MODULE: Module = {
	id: Collections.ProductCategories,
	name: 'PRODUCT_CATEGORIES',
	layout: {
		editTitleKey: 'name',
		sort: {
			active: 'name',
			direction: 'asc'
		},
		instance: {
			segments: [
				{
					title: 'General',
					fields: [
						'/name',
						'/description',
					]
				}
			]
		},
		table: {
			tableColumns: [
				CREATED_ON.column(),
				{key: '/name', label: 'NAME'},
				{key: '/description', label: 'DESCRIPTION'}
			]
		}
	},
	schema: {
		properties: {
			id: {type: 'string'},
			name: {type: 'string'},
			description: {type: 'string'},
			...CREATED_ON.property
		},
		required: [
			'name'
		]
	},
	definitions: {
		description: {
			component: {
				type: 'textarea',
				configuration: {
					rows: 5
				}
			}
		},
		...CREATED_ON.definition()
	},
	metadata: {
		docIdPrefix: 'prc'
	}
};
