import {CREATED_ON} from './shared/created-on';

export const FORMS_MODULE = {
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
          columnsDesktop: 6,
          columnsMobile: 12,
          title: 'General',
          fields: [
            '/id',
            '/createdOn',
            '/name',
            '/notify'
          ]
        },
        {
          columnsDesktop: 6,
          columnsMobile: 12,
          title: 'Content',
          fields: ['/success', '/error']
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
        {
          key: '/id',
          label: 'ID'
        },
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/id',
          label: 'Submission',
          pipe: ['custom', 'jpSanitize'],
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
      notify: {type: 'string'},
      name: {type: 'string'},
      success: {type: 'string'},
      error: {type: 'string'},
      fields: {type: 'array'},
      ...CREATED_ON.property,
    }
  },
  definitions: {
    id: {
      label: 'ID',
      hint: 'Populated automatically if left empty',
      disableOn: 'edit'
    },
    notify: {
      label: 'Send email notifications to:',
      component: {
        type: 'input',
        configuration: {
          type: 'email'
        }
      }
    },
    ...CREATED_ON.definition(),
    success: {
      label: 'Success message',
      placeholder: 'Application submitted successfully. Thank you!'
    },
    error: {
      label: 'Error message',
      placeholder:
        'There was an error submitting your form, please try again later.'
    },
    name: {
      label: 'Name'
    },
    fields: {
      component: {
        type: 'fu-fields'
      }
    }
  }
};
