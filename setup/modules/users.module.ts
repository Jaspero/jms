import {CREATED_ON} from './shared/created-on';

export const USERS_MODULE = {
  id: 'users',
  name: 'MODULES.USERS',
  description: 'MODULES.USERS_DESCRIPTION',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    filterModule: {
      persist: true,
      schema: {
        properties: {
          role: {type: 'string'},
          start: {type: 'string'},
          end: {type: 'string'}
        }
      },
      definitions: {
        start: {
          label: 'USERS.FILTERS.START_DATE',
          columnsDesktop: 6,
          filterKey: 'createdOn',
          filterMethod: '>',
          filterValuePipe: ['date'],
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
          filterMethod: '<',
          filterKey: 'createdOn',
          filterValuePipe: ['date'],
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
          component: {
            type: 'select',
            configuration: {
              populate: {
                collection: 'roles'
              }
            }
          }
        }
      },
      segments: [
        {
          type: 'empty',
          fields: ['/start', '/end', '/role']
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
          label: 'GENERAL.NAME'
        },
        {
          key: '/email',
          label: 'GENERAL.EMAIL'
        },
        {
          key: '/role',
          label: 'GENERAL.ROLE',
          control: true
        }
      ],
      actions: [
        {
          value: `it => '<jms-e-notes data-id="' + it.id + '"></jms-e-notes>'`
        },
        {
          value: `it => '<jms-e-tpr data-email="' + it.data.email + '"></jms-e-tpr>'`
        },
        {
          value: `it => '<jms-e-cp data-id="' + it.id + '"></jms-e-cp>'`
        },
        {
          value: `it => '<jms-e-tus data-id="' + it.id + '"></jms-e-tus>'`
        },
        {
          value: `it => '<jms-e-ce data-id="' + it.id + '"></jms-e-ce>'`
        }
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
    id: {label: 'GENERAL.ID'},
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
          searchBy: {
            key: '/name',
            label: 'Name'
          },
          display: {
            key: '/name',
            label: 'GENERAL.NAME'
          },
          table: {
            tableColumns: [
              {
                key: '/id',
                label: 'GENERAL.ID'
              },
              {
                key: '/name',
                label: 'GENERAL.NAME'
              }
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
