import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import {MODULES} from './modules';
import {CREATED_ON} from './shared/created-on';

export const ROLES_MODULE: Module = {
  id: Collections.Roles,
  name: 'ROLES',
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'GENERAL',
          fields: [
            '/name',
            '/description',
          ]
        },
        {
          title: 'PERMISSIONS',
          fields: [
            '/permissions'
          ]
        }
      ]
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
      name: {type: 'string'},
      description: {type: 'string'},
      permissions: {type: 'object'},
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
    permissions: {
      component: {
        type: 'permissions'
      }
    },
    ...CREATED_ON.definition()
  }
};
