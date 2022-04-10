import {Collections} from '../interfaces/collections';

export const ROLES_COLLECTION = {
  name: Collections.Roles,
  documents: [
    {
      id: 'admin',
      name: 'Admin',
      description: 'A user with access to all collections',
      createdOn: Date.now()
    },
    {
      id: 'user',
      name: 'User',
      description: 'A user with limited application access',
      createdOn: Date.now()
    }
  ]
};
