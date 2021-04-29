import {CREATED_ON} from './shared/created-on';

export const USERS_MODULE = {
  id: 'users',
  name: 'Users',
  description: 'App Users',
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
          label: 'Start Date',
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
          label: 'End Date',
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
          label: 'Role',
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
          label: 'Name'
        },
        {
          key: '/email',
          label: 'Email'
        },
        {
          key: '/role',
          label: 'Role',
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
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      email: {
        type: 'number'
      },
      role: {
        type: 'string'
      },
      photo: {
        type: 'string'
      },
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {
      type: 'ID'
    },
    name: {
      label: 'Name'
    },
    email: {
      label: 'Email',
      component: {
        type: 'input',
        configuration: {
          type: 'email'
        }
      }
    },
    role: {
      label: 'Role',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'roles',
            orderBy: 'name'
          }
        }
      }
    },
    photo: {
      label: 'Profile Photo',
      component: {
        type: 'image',
        configuration: {
          uploadMethods: [
            {
              id: 'file-manager',
              label: 'File Manager',
              component: '<jms-e-file-manager-select></jms-e-file-manager-select>',
              configuration: {
                route: '/generated',
                hidePath: true
              }
            }
          ]
        }
      }
    },
    ...CREATED_ON.definition()
  }
};
