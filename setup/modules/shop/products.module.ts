import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';
import {SHOP_LINK} from '../shared/link';
import {META} from '../shared/meta';
import {STRIPE_FORMAT, STRIPE_PIPE} from '../shared/stripe-pipe';

export const PRODUCTS_MODULE = {
  id: 'products',
  name: 'Products',
  authorization: {write: ['admin']},
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          type: 'tabs',
          configuration: {
            tabs: [
              {
                title: 'Product',
                fields: [
                  '/title',
                  '/id',
                  '/category',
                  '/sku',
                  '/excerpt'
                ]
              },
              {
                title: 'Inventory',
                fields: [
                  '/sku',
                  '/weight',
                  '/stock'
                ]
              },
              {
                title: 'Cost',
                fields: [
                  '/price',
                  '/salePrice',
                  '/sale'
                ]
              },
              META.segment()
            ]
          }
        },
        {
          title: 'Content',
          fields: ['/content']
        },
        {
          title: 'Variations',
          array: '/variations',
          columnsDesktop: 6,
          fields: ['/title', '/options']
        },
        {
          title: 'Gallery',
          fields: [
            '/gallery'
          ],
          columnsDesktop: 6
        },
        {
          title: 'Advanced Attributes',
          description: `When advanced attributes are enabled each variation is assigned its own price, sale price and sku.`,
          fields: [
            '/attributes'
          ]
        },
      ]
    },
    table: {
      tableColumns: [
        {
          key: '/gallery',
          label: 'Featured',
          pipe: ['custom'],
          pipeArguments: {
            0: `i => \`<img class="table-image" src="\${i.length ? i[0] : 'assets/product-placeholder.png'}" />\``
          }
        },
        {key: '/title', label: 'Title'},
        {key: '/id', label: 'URL', ...SHOP_LINK('products')},
        {
          key: '/price',
          label: 'Price',
          pipe: ['custom', 'currency'],
          pipeArguments: {
            0: STRIPE_PIPE
          }
        },
        {
          key: '/salePrice',
          label: 'Sale Price',
          pipe: ['custom', 'currency'],
          pipeArguments: {
            0: STRIPE_PIPE
          }
        },
        {key: '/sale', label: 'Sale', control: true},
        {key: '/excerpt', label: 'Excerpt'}
      ],
      actions: [{
        value: `v => '<jms-e-duplicate id="{{v.id}}"></jms-e-duplicate>'`
      }]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      title: {type: 'string'},
      excerpt: {type: 'string'},
      price: {type: 'number'},
      sale: {type: 'boolean'},
      salePrice: {type: 'number'},
      gallery: {type: 'array'},
      category: {type: 'string'},
      variations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {type: 'string'},
            options: {type: 'array'}
          }
        }
      },
      attributes: {type: 'string'},
      content: {type: 'string'},

      sku: {type: 'string'},
      weight: {type: 'number'},
      stock: {type: 'number'},

      ...CREATED_ON.property,
      ...META.property(),
    }
  },
  definitions: {
    id: {label: 'URL', formatOnSave: FORMAT_SEARCH(), columnsDesktop: 6},
    title: {label: 'Title', columnsDesktop: 6},
    excerpt: {label: 'Excerpt', component: {type: 'textarea'}},
    stock: {label: 'Units In Stock'},
    sku: {label: 'SKU'},
    weight: {
      label: 'Weight',
      component: {
        type: 'input',
        configuration: {
          suffix: 'kg'
        }
      }
    },
    // TODO: Thumbs
    gallery: {label: '', component: {type: 'gallery'}},
    category: {
      label: 'Category',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'shop-categories',
            orderBy: 'title',
            nameKey: 'title'
          }
        }
      }
    },
    price: {label: 'Price', ...STRIPE_FORMAT()},
    salePrice: {label: 'Sale Price', ...STRIPE_FORMAT()},
    sale: {label: 'Sale'},
    content: {label: '', component: {type: 'tinymce'}},
    attributes: {component: {type: 'product-variations'}},
    'variations/title': {label: 'Title'},
    'variations/options': {label: 'Options', component: {type: 'chips'}},
    ...CREATED_ON.definition(),
    ...META.definitions(),
  }
};
