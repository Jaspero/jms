import {Collections} from '../../interfaces/collections';
import {Module} from '../../interfaces/module.interface';
import {CREATED_ON} from '../shared/created-on';

export const ORDERS_MODULE: Module = {
	id: Collections.Orders,
	name: 'ORDERS',
	layout: {
		sort: CREATED_ON.sort,
		editTitleKey: 'id',
		instance: {
			segments: [
				{
					title: 'General',
					fields: [
						'/id',
						'/user',
						'/cart',
						'/status',
					]
				}
			]
		},
		table: {
			tableColumns: [
				CREATED_ON.column(),
				{key: '/status', label: 'STATUS'},
				{key: '/user', label: 'USER', populate: {collection: Collections.Users}},
				{key: '/cart', label: 'CART', populate: {collection: Collections.Carts}}
			]
		}
	},
	schema: {
		properties: {
			id: {type: 'string'},
			user: {type: 'string'},
			status: {type: 'string'},
			cart: {type: 'string'},
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
		cart: {
			component: {
				type: 'ref',
				configuration: {
					collection: Collections.Carts,
					search: {
            key: '/name',
            label: 'Name'
          },
					display: {
						label: 'Cart',
						key: '/name'
					},
					table: {
            tableColumns: [
              {
                key: '/name',
                label: 'Name'
              },
							{
								key: '/id',
								label: 'ID'
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
						{name: 'Paid', value: 'paid'},
						{name: 'Failed', value: 'failed'},
						{name: 'Canceled', value: 'canceled'},
						{name: 'Refunded', value: 'refunded'},
					]
				}
			}
		},
		...CREATED_ON.definition()
	},
	metadata: {
		docIdPrefix: 'prc'
	}
};
