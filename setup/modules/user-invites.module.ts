import {CREATED_ON} from './shared/created-on';

export const USER_INVITES_MODULE = {
  id: 'user-invites',
  name: 'Invites',
  description: 'Invites sent to new users',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    sort: CREATED_ON.sort,
    table: {
      hideImport: true,
      hideEdit: true,
      hideAdd: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/id',
          label: 'Email',
          pipe: ['custom'],
          pipeArguments: {
            0: `id => '<a target="_blank" href="mailto:{{id}}">{{id}}</a>'`
          }
        },
        {
          key: '/role',
          label: 'Role'
        },
        {
          key: '/requireReset',
          label: 'Require Reset',
          control: true
        },
        {
          key: '/sendInvite',
          label: 'Send Invite'
        },
        {
          key: '/acceptedOn',
          label: 'Accepted',
          pipe: ['date']
        }
      ]
    },
    overview: {
      toolbar: []
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      role: {type: 'string'},
      requireReset: {type: 'boolean'},
      sendInvite: {type: 'boolean'},
      accepted: {type: 'boolean'},
      acceptedOn: {type: 'number'},
    }
  }
};
