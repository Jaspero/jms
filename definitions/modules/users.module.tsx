import {FilterMethod} from '../enums/filter-method.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';
import {CREATED_ON} from './shared/created-on';
import {EMAIL_PIPE} from './shared/email-pipe';
import {YES_NO_FILTER_PIPE} from './shared/yes-no-pipe';

export const USERS_MODULE: Module = {
  id: Collections.Users,
  name: 'USERS',
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
          label: 'START_DATE',
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
          label: 'END_DATE',
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
          label: 'ROLE',
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
                collection: Collections.Roles
              }
            }
          }
        },
        active: {
          label: 'ACTIVE',
          ...YES_NO_FILTER_PIPE,
          component: {
            type: 'select',
            configuration: {
              reset: true,
              dataSet: [
                {name: 'ACTIVE', value: true},
                {name: 'IN_ACTIVE', value: false},
              ]
            }
          }
        },
        email: {
          label: 'EMAIL',
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
    sort: [
      CREATED_ON.sort,
      {
        active: 'active',
        direction: 'asc'
      }
    ],
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
          value: it => JSX(<jms-e-link icon="history" link={'/m/users/' + it.id + '/history'}>History</jms-e-link>)
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
        fields: ['/id', '/name', '/email', '/role', '/photo', '/invitedBy']
      }]
    },
    table: {
      hideImport: true,
      tableColumns: [
        {
          key: '/photo',
          label: 'PHOTO',
          pipe: [PipeType.Custom, PipeType.Sanitize],
          pipeArguments: {
            0: v => `<img src="${v || '/assets/images/profile-placeholder.png'}" width="50" height="50" style="border-radius:50px" />`
          }
        },
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'NAME',
          nestedColumns: [
            {key: '/email', label: 'EMAIL', ...EMAIL_PIPE}
          ]
        },
        {
          key: '/role',
          label: 'ROLE',
          control: true
        },
        {
          key: '/active',
          label: 'ACTIVE',
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
      invitedBy: {type: 'string'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {label: 'ID', disableOn: 'edit'},
    name: {label: 'NAME'},
    email: {
      label: 'EMAIL',
      component: {
        type: 'input',
        configuration: {
          type: 'email'
        }
      }
    },
    active: {label: 'ACTIVE'},
    role: {
      label: 'ROLE',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: Collections.Roles
          }
        }
      }
    },
    photo: {
      label: 'PROFILE_IMAGE',
      component: {
        type: 'image',
        configuration: {
          filePrefix: '/users',
          maxSize: 10485760,
          uploadMethods: [{
            id: 'storage',
            label: 'Storage',
            component: JSX(<jms-e-storage-select />),
            configuration: {
              route: '/users',
              hidePath: false,
              filters: [{
                value: (file) => file.contentType.startsWith('image/')
              }],
              allowUpload: false
            }
          }]
        }
      }
    },
    invitedBy: {
      label: 'INVITED_BY',
      component: {
        type: 'ref',
        configuration: {
          collection: Collections.Users,
          display: {
            key: '/name',
            label: 'INVITED_BY'
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
    ...CREATED_ON.definition()
  },
  spotlight: {
    queryFields: ['email', 'name'],
    template: (packet) => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(packet)], {type: 'application/json'}));
      return JSX(<jms-spotlight-result url={url} label='email' />)
    }
  },
  metadata: {
    deletedAuthUser: true,
    attachedFiles: {
      prefix: '/users/{{documentId}}/'
    },
    history: true,
    collections: [
      {
        name: Collections.UserInvites,
        filter: (_, data) => data.email
      }
    ],
    subCollections: [
      {name: Collections.History},
      {name: Collections.Notes},
      {name: 'authorization'}
    ]
  }
};
