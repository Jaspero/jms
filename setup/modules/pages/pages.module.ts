import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';
import {META} from '../shared/meta';
import {CONTENT_BLOCK} from './blocks/content.block';
import {FORM_BLOCK} from './blocks/form.block';
import {PROCESSED} from './processed.const';

const blocks = [
  CONTENT_BLOCK,
  FORM_BLOCK
];

export const PAGES_MODULE = {
  id: 'pages',
  name: 'MODULES.PAGES',
  authorization: {
    write: ['admin']
  },
  layout: {
    editTitleKey: 'title',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          type: 'card',
          fields: [
            '/id',
            '/createdOn',
            '/title'
          ]
        },
        {
          type: 'empty',
          fields: [
            '/blocks'
          ]
        },
        META.segment()
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {key: '/title', label: 'PB.FORM.TITLE'},
        {key: '/id', label: 'URL'}
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      title: {type: 'string'},
      blocks: {type: 'array'},
      ...CREATED_ON.property,
      ...META.property(),
    }
  },
  definitions: {
    ...CREATED_ON.definition(),
    id: {
      label: 'URL',
      disableOn: 'edit',
      formatOnSave: FORMAT_SEARCH(),
      hint: 'PB.FORM.ID_HINT'
    },
    title: {label: 'PB.FORM.TITLE'},
    blocks: {
      component: {
        type: 'pb-blocks',
        configuration: {
          styles: PROCESSED.css,
          blocks,
          styleUrls: []
        }
      }
    },
    ...META.definitions()
  }
};
