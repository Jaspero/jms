import {CREATED_ON} from './shared/created-on';
import {FORMAT_SEARCH} from './shared/format-search';
import {Module, PipeType} from './shared/module.type';

export const FORMS_MODULE: Module = {
  id: 'forms',
  name: 'MODULES.FORMS',
  description: '',
  authorization: {
    write: ['admin']
  },
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'GENERAL.GENERAL',
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
        {key: '/id', label: 'GENERAL.ID'},
        {key: '/name', label: 'GENERAL.NAME'},
        {
          key: '/id',
          label: 'Submission',
          pipe: [PipeType.Custom, PipeType.Sanitize],
          pipeArguments: {
            0: `(id => '<jms-e-link link=/m/forms/' + id + '/submissions >View</jms-e-link>')`
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
    name: {label: 'GENERAL.NAME'},
    success: {
      label: 'Success message',
      placeholder: 'Application submitted successfully. Thank you!'
    },
    error: {
      label: 'Error message',
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
