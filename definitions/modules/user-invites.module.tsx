import {PipeType} from '../enums/pipe-type.enum';
import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';
import {CREATED_ON} from './shared/created-on';
import {YES_NO_PIPE} from './shared/yes-no-pipe';

export const USER_INVITES_MODULE: Module = {
  id: Collections.UserInvites,
  name: 'USER_INVITES',
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
          label: 'EMAIL',
          pipe: [PipeType.Custom],
          pipeArguments: {
            0: id => JSX(<a target="_blank" href={'mailto:' + id}>{id}</a>)
          }
        },
        {
          key: '/role',
          label: 'ROLE',
          pipe: [PipeType.Titlecase]
        },
        {
          key: '/requireReset',
          label: 'REQUIRE_RESET',
          control: true
        },
        {
          key: '/sendInvite',
          label: 'SEND_INVITE',
          ...YES_NO_PIPE
        },
        {
          key: '/acceptedOn',
          label: 'ACCEPTED_ON',
          pipe: [PipeType.Date],
          fallback: 'NO'
        }
      ],
      actions: [
        {
          value: it => JSX(<jms-e-notes data-id={it.id}/>)
        }
      ]
    },
    overview: {
      toolbar: []
    }
  },
  definitions: {
    requireReset: {label: ''}
  },
  schema: {
    properties: {
      id: {type: 'string'},
      role: {type: 'string'},
      requireReset: {type: 'boolean'},
      sendInvite: {type: 'boolean'},
      accepted: {type: 'boolean'},
      acceptedOn: {type: 'number'},
      createdBy: {type: 'string'}
    }
  }
};
