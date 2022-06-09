import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';
import {META} from '../shared/meta';
import {PROCESSED} from './processed.const';
import {Module} from '../../interfaces/module.interface';
import {PipeType} from '../../enums/pipe-type.enum';
import JSX from '../../jsx.compiler';
import {SHARED_CONFIG} from '../../consts/shared-config.const';
import {STATUS} from '../shared/status';

export const PAGES_MODULE: Module = {
  id: 'pages',
  name: 'PAGES',
  authorization: {
    write: ['admin']
  },
  layout: {
    editTitleKey: 'title',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'GENERAL',
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
        {key: '/title', label: 'TITLE'},
        {
          key: '/id',
          label: 'URL',
          pipe: [PipeType.Custom],
          pipeArguments: {
            0: id => JSX(<a class="link" target="_blank" href={SHARED_CONFIG.webUrl + '/' + id}>{id}</a>)
          }
        },
        {key: '/active', label: 'ACTIVE', control: true},
        STATUS.column
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
              <jms-e-new-prepopulate icon="content_copy" collection="pages" methodFunc={method}>
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
      active: {type: 'boolean'},
      blocks: {type: 'array'},
      ...CREATED_ON.property,
      ...META.property(),
      ...STATUS.property
    }
  },
  definitions: {
    id: {
      label: 'URL',
      disableOn: 'edit',
      formatOnSave: FORMAT_SEARCH(),
      hint: 'ID_HINT'
    },
    title: {label: 'TITLE'},
    active: {label: ''},
    blocks: {
      component: {
        type: 'pb-blocks',
        configuration: {
          saveCompiled: true,
          styles: PROCESSED.css,
          styleUrls: []
        }
      }
    },
    ...CREATED_ON.definition(),
    ...META.definitions(),
    ...STATUS.definition
  }
};