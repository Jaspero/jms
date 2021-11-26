import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';
import {UPLOAD_METHODS} from '@shared/blocks/consts/upload-methods.const';

interface HeroOptions extends CommonOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  invertTextColor?: boolean;
}

@Block({
  id: 'hero',
  label: 'PB.FORM.BLOCKS.HERO.TITLE',
  icon: 'vertical_split',
  previewValue: {
    title: '<h2>Title</h2>',
    subtitle: '<h3>Subtitle</h3>',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet beatae cumque error excepturi fugit iusto nesciunt perferendis porro quasi quidem, quisquam totam ut. Aut consectetur debitis hic totam voluptas! At.</p>',
    image: '/assets/placeholder.png',
    imageAlt: 'Placeholder',
    invertTextColor: 'false',
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
      {
        type: 'empty',
        title: 'Options',
        icon: 'tune',
        fields: [
          '/invertTextColor'
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
        invertTextColor: {type: 'boolean'},
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
      invertTextColor: {label: 'Invert Text Color'},
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-hero',
  templateUrl: './hero.component.html',
  styleUrls: [
    '../common-styles.scss',
    './hero.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent extends CommonBlockComponent {
  @Input()
  data: HeroOptions;

  get addedClasses() {
    return [
      ...this.data.invertTextColor ? ['invert-text-color'] : [],
    ];
  }
}
