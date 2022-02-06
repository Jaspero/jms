import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';
import {META} from '../shared/meta';
import {JSX, Module} from '../shared/module.type';
import {PROCESSED} from './processed.const';

export const PAGES_MODULE: Module = {
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
          title: 'GENERAL.GENERAL',
          type: 'card',
          fields: [
            '/title',
            '/id'
          ],
          columnsDesktop: 6
        },
        META.segment({columnsDesktop: 6}),
        {
          type: 'empty',
          fields: [
            '/blocks'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {key: '/title', label: 'PB.FORM.TITLE'},
        {key: '/id', label: 'URL'}
      ],
      actions: [
        {
          value: it => {

            window['tempDuplicate'] = it.data.blocks;

            const method = () => {
              const blocks = [...window['tempDuplicate']];
              delete window['tempDuplicate'];
              return {blocks};
            }

            return JSX(
              <jms-e-new-prepopulate collection="pages" method={method}>
                Duplicate Blocks
              </jms-e-new-prepopulate>
            );
          }
        }
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
          styleUrls: []
        }
      }
    },
    ...CREATED_ON.definition(),
    ...META.definitions()
  }
};
