import {FilterMethod} from '../enums/filter-method.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';
import {CREATED_ON} from './shared/created-on';
import {EMAIL_PIPE} from './shared/email-pipe';
import {YES_NO_FILTER_PIPE} from './shared/yes-no-pipe';

export const USERS_MODULE: Module = {
  id: 'users',
  name: 'MODULES.USERS',
  description: 'MODULES.USERS_DESCRIPTION',
  layout: {
    editTitleKey: 'name',
    filterModule: {
      persist: true,
      schema: {
        properties: {
          role: {type: 'string'},
          start: {type: 'string'},
          end: {type: 'string'},
          email: {type: 'string'},
          active: {type: 'boolean', default: null}
        }
      },
      definitions: {
        start: {
          label: 'USERS.FILTERS.START_DATE',
          columnsDesktop: 6,
          filterKey: 'createdOn',
          filterMethod: FilterMethod.GreaterThen,
          filterValuePipe: [PipeType.Date],
          filterLabel: 'Start Date',
          component: {
            type: 'date',
            configuration: {
              format: 'number'
            }
          }
        },
        end: {
          label: 'USERS.FILTERS.END_DATE',
          columnsDesktop: 6,
          filterMethod: FilterMethod.LessThen,
          filterKey: 'createdOn',
          filterValuePipe: [PipeType.Date],
          filterLabel: 'End Date',
          component: {
            type: 'date',
            configuration: {
              format: 'number'
            }
          }
        },
        role: {
          label: 'GENERAL.ROLE',
          filterValuePipe: [PipeType.GetDocuments, PipeType.Custom],
          filterValuePipeArguments: {
            0: role => [`roles/${role}`],
            1: role => role[0].name
          },
          component: {
            type: 'select',
            configuration: {
              reset: true,
              populate: {
                collection: 'roles'
              }
            }
          }
        },
        active: {
          label: 'GENERAL.ACTIVE',
          ...YES_NO_FILTER_PIPE,
          component: {
            type: 'select',
            configuration: {
              reset: true,
              dataSet: [
                {name: 'GENERAL.ACTIVE', value: true},
                {name: 'GENERAL.IN_ACTIVE', value: false},
              ]
            }
          }
        },
        email: {
          label: 'GENERAL.EMAIL',
          component: {
            type: 'input',
            configuration: {
              type: 'email'
            }
          }
        }
      },
      segments: [
        {
          type: 'empty',
          fields: ['/start', '/end', '/email', '/role', '/active']
        }
      ]
    },
    sort: CREATED_ON.sort,
    instance: {
      actions: [
        {
          value: it => JSX(<jms-e-user-actions id={it.id}/>),
          authorization: ['admin'],
          menuStyle: false
        },
        {
          value: it => JSX(<jms-e-notes data-id={it.id}/>)
        },
        {
          value: it => JSX(<jms-e-tpr data-email={it.data.email}/>),
          authorization: ['admin']
        },
        {
          value: it => JSX(<jms-e-cp data-id={it.id}/>),
          authorization: ['admin']
        },
        {
          value: it => JSX(<jms-e-ce data-id={it.id}/>),
          authorization: ['admin']
        },
        {
          value: it => JSX(<jms-e-impersonate id={it.id}/>),
          authorization: ['admin']
        }
      ],
      segments: [{
        fields: ['/id', '/name', '/email', '/role', '/photo']
      }]
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'GENERAL.NAME',
          nestedColumns: [
            {key: '/email', label: 'GENERAL.EMAIL', ...EMAIL_PIPE}
          ]
        },
        {
          key: '/role',
          label: 'GENERAL.ROLE',
          control: true
        },
        {
          key: '/active',
          label: 'GENERAL.ACTIVE',
          control: true
        }
      ]
    },
    overview: {
      toolbar: [JSX(<jms-e-user-add/>)]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      email: {type: 'number'},
      role: {type: 'string'},
      photo: {type: 'string'},
      active: {type: 'boolean'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {label: 'GENERAL.ID', disableOn: 'edit'},
    name: {label: 'GENERAL.NAME'},
    email: {
      label: 'GENERAL.EMAIL',
      component: {
        type: 'input',
        configuration: {
          type: 'email'
        }
      }
    },
    active: {label: 'GENERAL.ACTIVE'},
    role: {
      label: 'GENERAL.ROLE',
      component: {
        type: 'ref',
        configuration: {
          collection: 'roles',
          clearValue: null,
          search: {key: '/name', label: 'GENERAL.NAME'},
          display: {key: '/name', label: 'GENERAL.ROLE'},
          table: {
            tableColumns: [
              {key: '/name', label: 'GENERAL.NAME'},
              {key: '/id', label: 'GENERAL.ID'}
            ]
          }
        }
      }
    },
    photo: {
      label: 'USERS.FIELDS.PROFILE_PHOTO',
      component: {
        type: 'image',
        configuration: () => {
          const route = `/users/${window.jms.util.docId}`;
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
    ...CREATED_ON.definition()
  },
  spotlight: {
    queryFields: ['name', 'email']
  }
};
