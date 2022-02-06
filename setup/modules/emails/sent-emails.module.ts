import {CREATED_ON} from '../shared/created-on';
import {Module, PipeType} from '../shared/module.type';

const STATUS_DEFINITION: any = {
  label: 'Status',
  component: {
    type: 'select',
    configuration: {
      dataSet: [
        {
          name: 'Success',
          value: true
        },
        {
          name: 'Fail',
          value: false
        }
      ]
    }
  }
};

const TEMPLATE_ID_DEFINITION: any = {
  label: 'Template ID',
  component: {
    type: 'select',
    configuration: {
      populate: {
        collection: 'automatic-emails',
        orderBy: 'name'
      }
    }
  }
};

export const SENT_EMAILS_MODULE: Module = {
  id: 'sent-emails',
  name: 'MODULES.SENT_EMAILS',
  layout: {
    editTitleKey: 'subject',
    sort: CREATED_ON.sort,
    filterModule: {
      clearFilters: [],
      segments: [
        {
          type: 'empty',
          fields: ['/status', '/templateId', '/to']
        }
      ],
      schema: {
        properties: {
          status: {type: 'boolean', default: null},
          templateId: {type: 'string'},
          to: {type: 'string'}
        }
      },
      definitions: {
        status: STATUS_DEFINITION,
        templateId: TEMPLATE_ID_DEFINITION,
        to: {
          label: 'Receiver'
        }
      }
    },
    instance: {
      segments: [
        {
          title: 'GENERAL.EMAILS',
          fields: ['/to', '/subject', '/html']
        },
        {
          title: 'Misc',
          fields: [
            '/status',
            '/createdOn',
            '/templateId',
            {
              field: '/error',
              deps: ['/error'],
              action: {
                type: 'show',
                function: `(row) => !!row.error`
              }
            }
          ]
        }
      ]
    },
    table: {
      hideAdd: true,
      hideImport: true,
      tableColumns: [
        {key: '/to', label: 'Receiver'},
        {key: '/subject', label: 'Subject'},
        CREATED_ON.column(true, 'YYYY/MM/dd hh:mm'),
        {
          key: '/status',
          label: 'Status',
          pipe: [PipeType.Custom],
          pipeArguments: {
            0: `v => v ? 'Sent' : 'Failed'`
          }
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      createdOn: {type: 'number'},
      to: {type: 'string'},
      status: {type: 'boolean'},
      html: {type: 'string'},
      templateId: {type: 'string'},
      subject: {type: 'number'},
      error: {type: 'string'}
    }
  },
  definitions: {
    to: {label: 'Receiver'},
    status: STATUS_DEFINITION,
    html: {
      label: 'Content',
      component: {
        type: 'tinymce'
      }
    },
    templateId: TEMPLATE_ID_DEFINITION,
    subject: {label: 'Subject'},
    error: {label: 'Error'}
  }
};
