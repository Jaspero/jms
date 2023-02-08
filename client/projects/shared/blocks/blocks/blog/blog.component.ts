import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface BlogOptions extends CommonOptions {
  title?: string;
  subtitle?: string;
}

@Block({
  label: 'BLOG',
  icon: 'article',
  previewValue: {
    title: 'Our Blog',
    subtitle: 'These are things we write about',
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      {
        title: 'CONTENT',
        icon: 'subject',
        fields: [
          '/title',
          '/subtitle'
        ],
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        title: {type: 'string'},
        subtitle: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      title: {label: 'TITLE'},
      subtitle: {
        label: 'SUBTITLE',
        component: {
          type: 'textarea',
          configuration: {
            rows: 5
          }
        }
      },
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent extends CommonBlockComponent<BlogOptions> {
  templateStyle = `<style>.card {color: green}</style>`
}
