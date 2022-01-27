import {CREATED_ON} from './shared/created-on';
import {EMAIL_PIPE} from './shared/email-pipe';
import {FilterMethod, Module, PipeType} from './shared/module.type';

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
          email: {type: 'string'}
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
          fields: ['/start', '/end', '/email', '/role']
        }
      ]
    },
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          fields: ['/createdOn', '/id', '/name', '/email', '/role', '/photo']
        }
      ]
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'GENERAL.NAME',
          nestedColumns: [
            {key: '/email', label: 'GENERAL.EMAIL', ...EMAIL_PIPE},
          ]
        },
        {
          key: '/role',
          label: 'GENERAL.ROLE',
          control: true
        }
      ],
      actions: [
        {
          value: it => `<jms-e-user-actions id="${it.id}"></jms-e-user-actions>`,
          authorization: ['admin'],
          menuStyle: false
        },
        {
          value: it => `<jms-e-notes data-id="${it.id}"></jms-e-notes>`,
        },
        {
          value: it => `<jms-e-tpr data-email="${it.data.email}"></jms-e-tpr>`,
          authorization: ['admin']
        },
        {
          value: it => `<jms-e-cp data-id="${it.id}"></jms-e-cp>`,
          authorization: ['admin']
        },
        {
          value: it => `<jms-e-ce data-id="${it.id}"></jms-e-ce>`,
          authorization: ['admin']
        },
        {
          value: it => `<jms-e-impersonate id="${it.id}"></jms-e-impersonate>`,
          authorization: ['admin']
        },
      ]
    },
    overview: {
      toolbar: ['<jms-e-user-add></jms-e-user-add>']
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      email: {type: 'number'},
      role: {type: 'string'},
      photo: {type: 'string'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {
      label: 'GENERAL.ID',
      disableOn: 'edit'
    },
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
    role: {
      label: 'GENERAL.ROLE',
      component: {
        type: 'ref',
        configuration: {
          collection: 'roles',
          valueKey: 'id',
          clearValue: null,
          search: {
            key: '/name',
            label: 'Name'
          },
          display: {
            key: '/name',
            label: 'GENERAL.NAME'
          },
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
        configuration: {
          uploadMethods: [
            {
              id: 'file-manager',
              label: 'FILE_MANAGER.TITLE',
              component:
                '<jms-e-file-manager-select></jms-e-file-manager-select>',
              configuration: {
                route: '/generated',
                hidePath: true,
                filters: [
                  {
                    value: `(file) => file.contentType.startsWith('image/')`
                  }
                ]
              }
            }
          ]
        }
      }
    },
    ...CREATED_ON.definition()
  },
  spotlight: {
    queryFields: ['name', 'email']
  }
};
