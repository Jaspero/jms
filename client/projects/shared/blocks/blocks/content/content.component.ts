import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface ContentOptions extends CommonOptions {
  content: string;
}

@Block({
  label: 'CONTENT',
  icon: 'article',
  module: ['pages', 'posts', 'products'],
  previewValue: {
    content: '<h1>Custom Title</h1><h2>Custom Subtitle</h2><p>Custom content</p>',
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      {
        title: 'CONTENT',
        icon: 'subject',
        fields: [
          '/content'
        ],
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        content: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      content: {
        label: '',
        component: {
          type: 'tinymce'
        }
      },
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-content',
  templateUrl: './content.component.html',
  styleUrls: [
    '../common-styles.scss',
    './content.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent extends CommonBlockComponent<ContentOptions> {}
