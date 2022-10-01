import {Collections} from '../../interfaces/collections';
import {Module} from '../../interfaces/module.interface';
import {CREATED_ON} from '../shared/created-on';

export const PRODUCTS_MODULE: Module = {
  id: Collections.Products,
  name: 'PRODUCTS',
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
						'/category',
						'/tags',
						'/active',
						'/shortDescription',
						'/fullDescription',
						'/images'
					]
				},
				{
					title: 'Pricing',
					fields: [
						'/price'
					]
				}
			]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {key: '/name', label: 'NAME'},
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
			category: {type: 'string'},
			tags: {type: 'array'},
			active: {type: 'boolean'},
			shortDescription: {type: 'string'},
			fullDescription: {type: 'string'},
			price: {type: 'number'},
			images: {type: 'array'},
      ...CREATED_ON.property
    },
		required: [
			'name',
			'active'
		]
  },
  definitions: {
		category: {
			component: {
				type: 'ref',
				configuration: {
					collection: Collections.ProductCategories,
					search: {
            key: '/name',
            label: 'Name'
          },
					display: {
						label: 'Category',
						key: '/name'
					},
					table: {
            tableColumns: [
              {
                key: '/name',
                label: 'Name'
              },
							{
								key: '/description',
								label: 'Description'
							}
            ]
          }
				}
			}
		},
		tags: {
			component: {
				type: 'ref',
				configuration: {
					collection: Collections.ProductTags,
					multiple: true,
					search: {
            key: '/name',
            label: 'Name'
          },
					display: {
						label: 'Category',
						key: '/name'
					},
					table: {
            tableColumns: [
              {
                key: '/name',
                label: 'Name'
              },
							{
								key: '/description',
								label: 'Description'
							}
            ]
          }
				}
			}
		},
		shortDescription: {
			component: {
				type: 'textarea',
				configuration: {
					rows: 5
				}
			}
		},
		fullDescription: {
			component: {
				type: 'tinymce'
			}
		},
		images: {
			component: {
				type: 'gallery'
			}
		},
    ...CREATED_ON.definition()
  }
};
