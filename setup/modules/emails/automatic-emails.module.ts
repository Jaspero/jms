import {PROCESSED} from './processed.const';

export const AUTOMATIC_EMAILS_MODULE = {
  id: 'automatic-emails',
  name: 'MODULES.AUTOMATIC_EMAILS',
  layout: {
    editTitleKey: 'name',
    instance: {
      segments: [
        {
          title: 'GENERAL.DESCRIPTION',
          components: [
            {
              selector: 'email-template-description'
            }
          ]
        },
        {
          title: 'GENERAL.GENERAL',
          fields: [
            '/id',
            '/name',
            '/description',
            '/recipient',
            '/sendTo',
            '/subject'
          ]
        },
        {
          type: 'empty',
          fields: ['/content']
        }
      ]
    },
    table: {
      hideImport: true,
      hideExport: true,
      tableColumns: [
        {key: '/name', label: 'GENERAL.NAME'},
        {key: '/recipient', label: 'AUTOMATIC_EMAILS.FIELDS.RECIPIENT'},
        {key: '/description', label: 'GENERAL.DESCRIPTION'},
        {key: '/subject', label: 'AUTOMATIC_EMAILS.FIELDS.SUBJECT'},
        {key: '/active', label: 'GENERAL.ACTIVE', control: true}
      ],
      actions: [
        {
          value: `it => '<jms-e-sample-email id="' + it.id + '"></jms-e-sample-email>'`
        }
      ]
    },
    filterModule: {
      persist: true,
      clearFilters: [],
      value: [
        {
          key: 'recipient',
          operator: '==',
          value: 'Admin',
          label: 'Admin'
        }
      ],
      segments: [{type: 'empty', fields: ['/recipient']}],
      schema: {
        properties: {
          recipient: {type: 'string'}
        }
      },
      definitions: {
        recipient: {
          label: 'AUTOMATIC_EMAILS.FIELDS.RECIPIENT',
          filterLabel: 'AUTOMATIC_EMAILS.FIELDS.RECIPIENT',
          component: {
            type: 'select',
            configuration: {
              dataSet: [
                {name: 'Admin', value: 'Admin'},
                {name: 'Client', value: 'Client'}
              ]
            }
          }
        }
      }
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      subject: {type: 'string'},
      content: {type: 'string'},
      description: {type: 'string'},
      active: {type: 'boolean'},
      dynamicValues: {type: 'string'},
      recipient: {type: 'string', default: 'Admin'},
      sendTo: {type: 'array'}
    }
  },
  definitions: {
    id: {label: 'ID', disableOn: 'edit'},
    sendTo: {label: 'AUTOMATIC_EMAILS.FIELDS.SEND_TO', component: {type: 'chips'}},
    description: {label: 'GENERAL.DESCRIPTION'},
    subject: {
      label: 'AUTOMATIC_EMAILS.FIELDS.SUBJECT',
      component: {
        type: 'textarea'
      }
    },
    recipient: {
      label: 'AUTOMATIC_EMAILS.FIELDS.RECIPIENT',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'Admin', value: 'Admin'},
            {name: 'Client', value: 'Client'}
          ]
        }
      }
    },
    content: {
      label: 'GENERAL.CONTENT',
      component: {
        type: 'template-editor',
        configuration: {
          defaultTemplate: 'newsletter',
          templates: [
            {
              id: 'newsletter',
              layout: PROCESSED.layout,
              defaultSegments: ['section'],
              style: PROCESSED.css,
              segments: [
                {
                  id: 'section',
                  name: 'AUTOMATIC_EMAILS.TEMPLATES.SECTION',
                  content: PROCESSED.segments['section']
                }
              ]
            }
          ]
        }
      }
    }
  }
};
