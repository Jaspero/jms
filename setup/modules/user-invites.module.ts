import {CREATED_ON} from './shared/created-on';

export const USER_INVITES_MODULE = {
  id: 'user-invites',
  name: 'MODULES.USER_INVITES',
  description: 'MODULES.USER_INVITES_DESCRIPTION',
  layout: {
    sort: CREATED_ON.sort,
    table: {
      hideImport: true,
      hideEdit: true,
      hideAdd: true,
      columns: [
        CREATED_ON.column(),
        {
          key: '/id',
          label: 'GENERAL.EMAIL',
          pipe: ['custom'],
          pipeArguments: {
            0: `id => '<a target="_blank" href="mailto:{{id}}">{{id}}</a>'`
          }
        },
        {
          key: '/role',
          label: 'GENERAL.ROLE'
        },
        {
          key: '/requireReset',
          label: 'USER_INVITES.FIELDS.REQUIRE_RESET',
          control: true
        },
        {
          key: '/sendInvite',
          label: 'USER_INVITES.FIELDS.SEND_INVITE'
        },
        {
          key: '/acceptedOn',
          label: 'USER_INVITES.FIELDS.ACCEPTED_ON',
          pipe: ['date'],
          fallback: 'No'
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
