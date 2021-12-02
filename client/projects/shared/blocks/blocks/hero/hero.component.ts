import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface HeroOptions extends CommonOptions {
  title?: string;
  subtitle?: string;
  content?: string;
  darkBackground?: boolean;
  iframe?: string;
  links: Array<{
    script?: boolean;
    link?: string;
    linkHref?: string;
    linkStyle?: string;
    icon?: string;
  }>;
  x: string;
  y: string;
  arrowButton?: boolean;
  image?: string;
  imageAlt?: string;
  overlay?: boolean;
  text?: string;
  link?: string;
  linkHref?: string;
  hideLoggedIn?: boolean;
  list?: string[];
  contentWidth?: string;
  containerWidth?: string;
  mBackground?: string;
  mX?: number;
  mY?: number;
  mSize?: number;
}

@Block({
  id: 'hero',
  label: 'Hero',
  module: ['pages', 'studios', 'shop-pages'],
  icon: 'image',
  previewValue: {
    title: '<h1>OUR WORKOUTS</h1>',
    subtitle: '<h2>Example subtitle</h2>',
    links: [],
    ...COMMON_OPTIONS.defaults,
    background: '/assets/placeholder.png',
    backgroundSize: 'cover'
  },
  form: {
    segments: [
      {
        title: (index: number) => index === undefined ? 'Link' : `Link ${index + 1}`,
        icon: 'link',
        array: '/links',
        fields: [
          '/link',
          '/linkHref',
          '/linkStyle',
          '/icon',
          '/script'
        ]
      },
      {
        title: 'Segment Options',
        icon: 'tune',
        type: 'empty',
        fields: [
          '/darkBackground',
          '/iframe'
        ]
      },
      {
        title: 'Mobile',
        fields: [
          '/mBackground',
          '/mSize',
          '/mX',
          '/mY'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        darkBackground: {type: 'string'},
        title: {type: 'string'},
        subtitle: {type: 'string'},
        mBackground: {type: 'string'},
        mSize: {type: 'number'},
        mX: {type: 'number'},
        mY: {type: 'number'},
        iframe: {type: 'string'},
        links: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              script: {type: 'boolean'},
              link: {type: 'string', default: 'Example'},
              linkHref: {type: 'string'},
              linkStyle: {type: 'string', default: 'button-flat'},
              icon: {type: 'string'}
            }
          }
        },
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      ...COMMON_OPTIONS.definitions,
      darkBackground: {
        label: 'Dark Overlay',
        component: {
          type: 'slider',
          configuration: {
            thumbLabel: true,
            tickInterval: 1,
            starAt: 0,
            endAt: 100
          }
        }
      },
      'links/link': {label: 'Title'},
      'links/linkHref': {
        label: 'URL',
        component: {
          type: 'input',
          configuration: {
            type: 'url'
          }
        }
      },
      'links/icon': {
        label: 'Icon',
        hint: 'Name of the material icon'
      },
      '/links/script': {label: 'Script'},
      iframe: {label: 'iFrame'},
      'links/linkStyle': {
        label: 'Style',
        component: {
          type: 'select',
          configuration: {
            dataSet: [
              {name: 'Flat(white)', value: 'button-flat-white'},
              {name: 'Flat(color)', value: 'button-flat'},
              {name: 'Border', value: 'button-border'},
              {name: 'Ghost', value: 'button-ghost'}
            ]
          }
        }
      },
      mBackground: {
        label: 'Background',
        component: {
          type: 'input',
          configuration: {
            type: 'color'
          }
        }
      },
      mSize: {label: 'Size'},
      mX: {label: 'X Position'},
      mY: {label: 'Y Position'}
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
      ...this.data.iframe ? ['no-bg'] : []
    ];
  }

  get class() {
    return [`x-${this.data.x}`, `y-${this.data.y}`].join(' ');
  }

  get contentWidth() {
    return this.data.contentWidth
      ? {maxWidth: this.unit(this.data.contentWidth)}
      : {};
  }

  get containerWidth() {
    return this.data.containerWidth
      ? {maxWidth: this.unit(this.data.containerWidth)}
      : {};
  }

  get mobileStyle() {
    return {
      'background-image': `url('${this.data.background}')`,
      'background-color': this.data.mBackground || '',
      'background-size': `${this.data.mSize || 100}%`,
      'background-position': `${this.data.mX || 0}% ${this.data.mY || 0}%`
    };
  }

  unit(value: string) {
    return /[A-Za-z]/.test(value) ? value : `${value}px`;
  }

  loadScript(script: string) {
    Function(script)();
  }
}
