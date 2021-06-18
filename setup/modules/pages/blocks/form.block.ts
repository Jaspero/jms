import {COMMON_OPTIONS} from './shared';

export const FORM_BLOCK = {
  id: 'form',
  label: 'PB.FORM.BLOCKS.FORM.TITLE',
  icon: 'contact_mail',
  previewTemplate: `<jms-form [data]="data"></jms-form>`,
  previewValue: {
    title: 'Form Title',
    description: 'Form description',
  },
  form: {
    segments: [
      {
        title: 'Content',
        fields: [
          '/action',
          '/form'
        ]
      },
      {
        title: 'Options',
        fields: [
          '/email',
          '/size'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        action: {type: 'string'},
        form: {type: 'string'},
        size: {type: 'string'},
        email: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      action: {label: 'PB.FORM.BLOCKS.FORM.FIELDS.ACTION'},
      form: {
        label: 'PB.FORM.BLOCKS.FORM.TITLE',
        component: {
          type: 'select',
          configuration: {
            populate: {
              collection: 'forms'
            }
          }
        }
      },
      ...COMMON_OPTIONS.definitions
    }
  }
};
