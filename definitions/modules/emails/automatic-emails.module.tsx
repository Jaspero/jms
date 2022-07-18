import {Module} from '../../interfaces/module.interface';
import JSX from '../../jsx.compiler';
import {PROCESSED} from './processed.const';

export const AUTOMATIC_EMAILS_MODULE: Module = {
  id: 'automatic-emails',
  name: 'AUTOMATIC_EMAILS',
  layout: {
    editTitleKey: 'name',
    instance: {
      segments: [
        {
          title: 'DESCRIPTION',
          components: [
            {
              selector: 'email-template-description'
            }
          ]
        },
        {
          title: 'GENERAL',
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
          fields: [
            '/blocks'
          ]
        }
      ]
    },
    table: {
      hideImport: true,
      hideExport: true,
      tableColumns: [
        {key: '/name', label: 'NAME'},
        {key: '/recipient', label: 'RECIPIENT'},
        {key: '/description', label: 'DESCRIPTION'},
        {key: '/subject', label: 'SUBJECT'},
        {key: '/active', label: 'ACTIVE', control: true}
      ],
      actions: [
        {
          value: it => JSX(<jms-e-sample-email id={it.id} />)
        }
      ]
    },
    filterModule: {
      persist: true,
      clearFilters: [],
      segments: [{type: 'empty', fields: ['/recipient']}],
      schema: {
        properties: {
          recipient: {type: 'string'}
        }
      },
      definitions: {
        recipient: {
          label: 'RECIPIENT',
          filterLabel: 'RECIPIENT',
          component: {
            type: 'select',
            configuration: {
              dataSet: [
                {name: 'Admin', value: 'Admin'},
                {name: 'User', value: 'User'}
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
      blocks: {type: 'array'},
      description: {type: 'string'},
      active: {type: 'boolean'},
      dynamicValues: {type: 'string'},
      recipient: {type: 'string', default: 'Admin'},
      sendTo: {type: 'array'}
    }
  },
  definitions: {
    id: {label: 'ID', disableOn: 'edit'},
    sendTo: {label: 'SEND_TO', component: {type: 'chips'}},
    description: {label: 'DESCRIPTION'},
    subject: {
      label: 'SUBJECT',
      component: {
        type: 'textarea'
      }
    },
    recipient: {
      label: 'RECIPIENT',
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
    blocks: {
      component: {
        type: 'pb-blocks',
        configuration: {
          intro: `<p style="margin-bottom:10px"><b>Template Editor</b></p><p style="margin-bottom:10px">Edit the email template here.</p>`,
          layout: {
            selector: '.main-content',
            content: PROCESSED.layout
          },
          saveCompiled: {
            removeWrapper: true
          },
          styles: PROCESSED.css,
          styleUrls: []
        }
      }
    },
  }
};
