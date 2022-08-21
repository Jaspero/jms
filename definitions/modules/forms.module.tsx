import {PipeType} from '../enums/pipe-type.enum';
import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';
import {CREATED_ON} from './shared/created-on';
import {FORMAT_SEARCH} from './shared/format-search';

export const FORMS_MODULE: Module = {
  id: 'forms',
  name: 'FORMS',
  description: '',
  authorization: {
    write: ['admin']
  },
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'GENERAL',
          fields: [
            '/name',
            '/success',
            '/error'
          ]
        },
        {
          type: 'empty',
          fields: ['/fields']
        }
      ]
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {key: '/id', label: 'ID'},
        {key: '/name', label: 'NAME'},
        {
          key: '/id',
          label: 'SUBMISSION',
          pipe: [PipeType.Custom, PipeType.Sanitize],
          pipeArguments: {
            0: id => JSX(<jms-e-link link={'/m/forms/' + id + '/submissions'}>View</jms-e-link>)
          }
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      success: {type: 'string'},
      error: {type: 'string'},
      fields: {type: 'array'},
      ...CREATED_ON.property,
    }
  },
  definitions: {
    id: {formatOnSave: FORMAT_SEARCH('name')},
    name: {label: 'NAME'},
    success: {
      label: 'SUCCESS_MESSAGE',
      placeholder: 'Application submitted successfully. Thank you!'
    },
    error: {
      label: 'ERROR_MESSAGE',
      placeholder:
        'There was an error submitting your form, please try again later.'
    },
    fields: {
      component: {
        type: 'fu-fields'
      }
    },
    ...CREATED_ON.definition(),
  }
};
