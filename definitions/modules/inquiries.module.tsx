import {PipeType} from '../enums/pipe-type.enum';
import {Collections} from '../interfaces/collections';
import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';
import {CREATED_ON} from './shared/created-on';

export const INQUIRIES_MODULE: Module = {
  id: Collections.Inquiries,
  name: 'INQUIRIES',
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [{
        fields: [
          '/name',
          '/email',
					'/message'
        ]
      }]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {key: '/name', label: 'NAME'},
        {
					key: '/email',
					label: 'EMAIL',
					pipe: [PipeType.Custom, PipeType.Sanitize],
					pipeArguments: {
						0: v => JSX(<a href={`mailto:${v}`}>{v}</a>)
					}
				},
        {key: '/message', label: 'MESSAGE'},
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string',},
      email: {type: 'string',},
      message: {type: 'string',},
      ...CREATED_ON.property
    }
  },
  definitions: {
    name: {label: 'NAME'},
		email: {label: 'EMAIL'},
    message: {
      label: 'MESSAGE',
      component: {
        type: 'textarea',
				configuration: {
					rows: 5
				}
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
