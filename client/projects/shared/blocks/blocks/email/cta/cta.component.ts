import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Block, BlockData, BlockDataOptions} from '@jaspero/fb-page-builder';

export interface CtaOptions extends BlockDataOptions {
  label: string;
  link: string
}

@Block({
  label: 'CTA',
  icon: 'link',
  module: ['automatic-emails'],
  previewValue: {
    label: `Link`,
    link: `https://jaspero-jms.web.app`
  },
  form: {
    schema: {
      properties: {
        label: {type: 'string'},
        link: {type: 'string'}
      }
    },
    definitions: {
      label: {label: 'LABEL'},
      link: {label: 'URL'}
    },
    segments: [{
      type: 'empty',
      title: 'SEGMENT_OPTIONS',
      icon: 'tune',
      fields: [
        '/label',
        '/link'
      ]
    }]
  }
})
@Component({
  selector: 'jms-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaComponent extends BlockData<CtaOptions> { }
