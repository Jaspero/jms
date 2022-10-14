import {Collections} from '../interfaces/collections';
import {MODULES} from '../modules/modules';

export const ROLES_COLLECTION = {
  name: Collections.Roles,
  documents: [
    {
      id: 'admin',
      name: 'Admin',
      description: 'A user with access to all collections',
      createdOn: Date.now(),
      permissions: MODULES.reduce((acc, cur) => {
        acc[cur.id] = {get: true, list: true, create: true, update: true, delete: true};
        return acc;
      }, {})
    },
    {
      id: 'user',
      name: 'User',
      description: 'A user with limited application access',
      createdOn: Date.now(),
      permissions: {}
    }
  ]
};
