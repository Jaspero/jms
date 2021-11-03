import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface FormOptions extends CommonOptions {
  title?: string;
  description?: string;
  action?: string;
  form?: string;
  email?: string;
}

@Block({
  id: 'form',
  label: 'PB.FORM.BLOCKS.FORM.TITLE',
  icon: 'contact_mail',
  previewValue: {
    title: '<h2>Form Title</h2>',
    description: '<h3>Form description</h3>',
    fields: []
  },
  form: {
    segments: [
      {
        type: 'empty',
        title: 'Segment Options',
        icon: 'tune',
        fields: [
          '/form',
          '/email',
          '/action'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        form: {type: 'string'},
        email: {type: 'string'},
        action: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      form: {
        component: {
          type: 'ref',
          configuration: {
            collection: 'forms',
            searchBy: {key: '/name', label: 'GENERAL.NAME'},
            display: {key: '/name', label: 'PB.FORM.BLOCKS.FORM.FIELDS.FORM'},
            table: {
              tableColumns: [
                {key: '/name', label: 'GENERAL.NAME'}
              ]
            }
          }
        }
      },
      email: {
        component: {
          type: 'ref',
          configuration: {
            collection: 'automatic-emails',
            searchBy: {key: '/name', label: 'GENERAL.NAME'},
            display: {key: '/name', label: 'GENERAL.EMAIL'},
            table: {
              tableColumns: [
                {key: '/name', label: 'GENERAL.NAME'},
                {key: '/description', label: 'GENERAL.DESCRIPTION'},
              ]
            }
          }
        }
      },
      action: {label: 'Action'},
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent extends CommonBlockComponent {
  @Input() data: FormOptions;
}
