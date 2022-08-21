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
  label: 'FORM',
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
        title: 'SEGMENT_OPTIONS',
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
            searchBy: {key: '/name', label: 'NAME'},
            display: {key: '/name', label: 'FORM'},
            table: {
              tableColumns: [
                {key: '/name', label: 'NAME'}
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
            searchBy: {key: '/name', label: 'NAME'},
            display: {key: '/name', label: 'EMAIL'},
            table: {
              tableColumns: [
                {key: '/name', label: 'NAME'},
                {key: '/description', label: 'DESCRIPTION'},
              ]
            }
          }
        }
      },
      action: {label: 'ACTION'},
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
export class FormComponent extends CommonBlockComponent<FormOptions> {}
