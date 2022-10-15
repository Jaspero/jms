import {Collections} from '../../interfaces/collections';
import {Module} from '../../interfaces/module.interface';
import {CREATED_ON} from '../shared/created-on';

export const CARTS_MODULE: Module = {
	id: Collections.Carts,
	name: 'CARTS',
	layout: {
		sort: CREATED_ON.sort,
		editTitleKey: 'id',
		instance: {
			segments: [
				{
					title: 'General',
					fields: [
						'/id',
						'/name',
						'/user',
						'/status',
					]
				},
				{
					title: 'Items',
					array: '/items',
					fields: [
						'/product',
						'/quantity'
					]
				}
			]
		},
		table: {
			tableColumns: [
				CREATED_ON.column(),
				{key: '/id', label: 'ID'},
				{
					key: '/user',
					label: 'USER',
					populate: {
						collection: Collections.Users
					}
				}
			]
		}
	},
	schema: {
		properties: {
			id: {type: 'string'},
			user: {type: 'string'},
			name: {type: 'string'},
			status: {type: 'string'},
			items: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						product: {type: 'string'},
						quantity: {type: 'number'}
					}
				}
			},
			...CREATED_ON.property
		},
		required: [
			'user',
			'status'
		]
	},
	definitions: {
		id: {
			disableOn: ['edit']
		},
		user: {
			component: {
				type: 'ref',
				configuration: {
					collection: Collections.Users,
					search: {
            key: '/name',
            label: 'Name'
          },
					display: {
						label: 'User',
						key: '/name'
					},
					table: {
            tableColumns: [
              {
                key: '/name',
                label: 'Name'
              },
							{
								key: '/email',
								label: 'Email'
							}
            ]
          }
				}
			}
		},
		status: {
			component: {
				type: 'select',
				configuration: {
					dataSet: [
						{name: 'Pending', value: 'pending'},
						{name: 'Completed', value: 'completed'},
						{name: 'Abandoned', value: 'abandoned'}
					]
				}
			}
		},
		'items/product': {
			columnsDesktop: 6,
			component: {
				type: 'ref',
				configuration: {
					collection: Collections.Products,
					search: {
            key: '/name',
            label: 'Name'
          },
					display: {
						label: 'Product',
						key: '/name'
					},
					table: {
            tableColumns: [
              {
                key: '/name',
                label: 'Name'
              },
							{
								key: '/shortDescription',
								label: 'Short Description'
							},
							{
								key: '/price',
								label: 'Price'
							}
            ]
          }
				}
			}
		},
		'items/quantity': {
			columnsDesktop: 6
		},
		...CREATED_ON.definition()
	},
	metadata: {
		docIdPrefix: 'prc'
	}
};
