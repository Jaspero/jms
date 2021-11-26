import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';
import {UPLOAD_METHODS} from '@shared/blocks/consts/upload-methods.const';

interface TextImageOptions extends CommonOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

@Block({
  id: 'text-image',
  label: 'PB.FORM.BLOCKS.TEXT-IMAGE.TITLE',
  icon: 'vertical_split',
  previewValue: {
    title: '<h2>Title</h2>',
    subtitle: '<h3>Subtitle</h3>',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet beatae cumque error excepturi fugit iusto nesciunt perferendis porro quasi quidem, quisquam totam ut. Aut consectetur debitis hic totam voluptas! At.</p>',
    image: '/assets/placeholder.png',
    imageAlt: 'Placeholder',
    fields: [],
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      {
        type: 'empty',
        title: 'Image Options',
        icon: 'image',
        fields: [
          '/image',
          '/imageAlt',
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        title: {type: 'string'},
        subtitle: {type: 'string'},
        description: {type: 'string'},
        image: {type: 'string'},
        imageAlt: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      image: {
        label: 'Image',
        component: {
          type: 'image',
          configuration: {
            ...UPLOAD_METHODS
          }
        }
      },
      imageAlt: {label: 'Image Alt'},
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-text-image',
  templateUrl: './text-image.component.html',
  styleUrls: [
    '../common-styles.scss',
    './text-image.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextImageComponent extends CommonBlockComponent {
  @Input()
  data: TextImageOptions;
}
