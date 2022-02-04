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
        {key: '/name', label: 'GENERAL.NAME'},
        {key: '/description', label: 'GENERAL.DESCRIPTION'}
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
  }
};
