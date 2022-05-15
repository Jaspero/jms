import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import {CREATED_ON} from './shared/created-on';

export const ROLES_MODULE: Module = {
  id: Collections.Roles,
  name: 'ROLES',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [{
        fields: [
          '/name',
          '/description'
        ]
      }]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {key: '/name', label: 'NAME'},
        {key: '/description', label: 'DESCRIPTION'}
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
    name: {label: 'NAME'},
    description: {
      label: 'DESCRIPTION',
      component: {
        type: 'textarea'
      }
    },
    ...CREATED_ON.definition()
  },
  metadata: {
    attachedFiles: {
      containes: false
    }
  }
};
