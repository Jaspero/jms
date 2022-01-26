import {CREATED_ON} from './shared/created-on';
import {Module} from './shared/module.type';

export const ROLES_MODULE: Module = {
  id: 'roles',
  name: 'MODULES.ROLES',
  description: 'MODULES.ROLES_DESCRIPTION',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          components: [
            {
              selector: 'duplicate'
            }
          ]
        },
        {
          fields: [
            '/createdOn',
            '/name',
            '/description'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'GENERAL.NAME'
        },
        {
          key: '/description',
          label: 'GENERAL.DESCRIPTION'
        }
      ],
      actions: [
        {
          value: `it => '<jms-e-new-prepopulate collection="users" data-name="Prefill Test" data-email="{{it.data.description}}" label="Assign User"></jms-e-new-prepopulate>'`
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string',},
      description: {type: 'string',},
      ...CREATED_ON.property
    },
    required: [
      'name',
      'createdOn'
    ]
  },
  definitions: {
    name: {label: 'GENERAL.NAME'},
    description: {
      label: 'GENERAL.DESCRIPTION',
      component: {
        type: 'textarea'
      }
    },
    ...CREATED_ON.definition()
  },
  metadata: {
    autoSave: 0
  }
};
