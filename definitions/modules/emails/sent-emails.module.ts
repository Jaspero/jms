import {PipeType} from '../../enums/pipe-type.enum';
import {Module} from '../../interfaces/module.interface';
import {CREATED_ON} from '../shared/created-on';

const STATUS_DEFINITION: any = {
  label: 'STATUS',
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
  label: 'TEMPLATE_ID',
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
  name: 'SENT_EMAILS',
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
          label: 'RECEIVER'
        }
      }
    },
    instance: {
      segments: [
        {
          title: 'EMAILS',
          fields: ['/to', '/subject', '/html']
        },
        {
          title: 'MISC',
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
        {key: '/to', label: 'RECEIVER'},
        {key: '/subject', label: 'SUBJECT'},
        CREATED_ON.column(true, 'YYYY/MM/dd hh:mm'),
        {
          key: '/status',
          label: 'STATUS',
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
    to: {label: 'RECEIVER'},
    status: STATUS_DEFINITION,
    html: {
      label: 'CONTENT',
      component: {
        type: 'tinymce'
      }
    },
    templateId: TEMPLATE_ID_DEFINITION,
    subject: {label: 'SUBJECT'},
    error: {label: 'ERROR'}
  }
};
