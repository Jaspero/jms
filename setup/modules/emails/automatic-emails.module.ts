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
      sendTo: {type: 'string'}
    }
  },
  definitions: {
    sendTo: {label: 'AUTOMATIC_EMAILS.FIELDS.SEND_TO'},
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
              style: `.body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:18px;font-weight:lighter;color:#09371f;background:#f3edd9}.footer-content,.header-content,.main-content{padding:3ch 2ch;max-width:52ch;margin:1ch auto}.main-content{background:#fff;border-radius:1ch;border:1px solid #cdd7d2}.footer-content>*{font-size:.875rem}.logo{display:block;margin:auto}section{border-left:4px solid #cdd7d2;padding:1px 0 1px 1em;margin:2em 0}hr{outline:0;border:none;border-top:1px dashed #cdd7d2;margin:2em 0}.button{display:inline-block;margin:2ch 0;background:#e66439;color:#fff!important;font-size:.875rem;font-family:inherit;padding:1.5ch 2ch;border:none;border-radius:.5ch;cursor:pointer;text-decoration:none;}.button:hover{outline:2px dashed #e66439;outline-offset:4px}.button:disabled{opacity:.5;pointer-events:none}h1,h2{font-family:"Iowan Old Style","Apple Garamond",Baskerville,"Times New Roman","Droid Serif",Times,"Source Serif Pro",serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-weight:inherit}h1{font-size:2rem;margin:.5em 0}h2{font-size:1.5rem;margin:.75em 0}h3{margin:.875em 0;font-size:1.125rem;font-weight:400}.image{max-width:100%}`,
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
