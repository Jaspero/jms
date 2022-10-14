import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';
import {META} from '../shared/meta';
import {PROCESSED} from './processed.const';
import {Module} from '../../interfaces/module.interface';
import {PipeType} from '../../enums/pipe-type.enum';
import JSX from '../../jsx.compiler';
import {SHARED_CONFIG} from '../../consts/shared-config.const';
import {STATUS} from '../shared/status';
import {Collections} from '../../interfaces/collections';

export const POSTS_MODULE: Module = {
  id: 'posts',
  name: 'POSTS',
  layout: {
    editTitleKey: 'title',
    sort: {
			active: 'publishedOn',
			direction: 'desc'
		},
    instance: {
      segments: [
        {
          title: 'GENERAL',
          type: 'card',
          fields: [
            '/title',
            '/id',
						'/author',
						'/featuredImage',
            '/publishedOn',
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
				{
          key: '/featuredImage',
          label: 'FEATURED_IMAGE',
          pipe: [PipeType.Custom, PipeType.Sanitize],
          pipeArguments: {
            0: v => `<img src="${v || '/assets/images/post-placeholder.jpeg'}" width="100" height="100" />`
          }
        },
        {
					key: '/publishedOn',
					label: 'DATE',
					pipe: [PipeType.Date],
					sortable: true
				},
        {key: '/title', label: 'TITLE'},
        {
          key: '/id',
          label: 'URL',
          pipe: [PipeType.Custom],
          pipeArguments: {
            0: id => JSX(<a class="link" target="_blank" href={SHARED_CONFIG.webUrl + id}>{id}</a>)
          }
        },
				{
					key: '/author',
					label: 'AUTHOR',
					populate: {
						collection: 'users',
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
			author: {type: 'string'},
			featuredImage: {type: 'string'},
			publishedOn: {type: 'number'},
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
		featuredImage: {
			label: 'FEATURED_IMAGE',
			component: {
        type: 'image',
        configuration: () => {
          const route = `/posts/${window.jms.util.docId}`;
          const minPath = window.jms.util.state.role !== 'admin' ? route : `/`;

          return {
            filePrefix: route + '/',
            uploadMethods: [{
              id: 'file-manager',
              label: 'FILE_MANAGER.TITLE',
              component: JSX(<jms-e-file-manager-select/>),
              configuration: {
                hidePath: false,
                hideFolders: false,
                allowUpload: true,
                minPath,
                route,
                filters: [{
                  value: file => file.contentType.startsWith('image/')
                }]
              }
            }]
          }
        }
      }
		},
    author: {
      component: {
        type: 'ref',
        configuration: {
          collection: Collections.Users,
          display: {
            key: '/name',
            label: 'AUTHOR'
          },
          table: {
            tableColumns: [
              {key: '/name', label: 'NAME'},
              {key: '/email', label: 'EMAIL'}
            ]
          },
          search: {
            key: '/name',
            label: 'NAME',
            method: ({configuration, search, cursor}) =>
              window.jms.util.refSearch(
                configuration.collection,
                search,
                configuration.limit,
                cursor,
                configuration
              )
          }
        }
      }
    },
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
    publishedOn: {
      label: 'PUBLISHED_ON',
      formatOnLoad: '(value) => value || Date.now()',
      component: {
        type: 'date',
        configuration: {
          includeTime: true,
          labelHours: 'HOURS',
          labelMinutes: 'MINUTES',
          format: 'number'
        }
      }
    },
    ...CREATED_ON.definition(),
    ...META.definitions(),
    ...STATUS.definition
  }
};