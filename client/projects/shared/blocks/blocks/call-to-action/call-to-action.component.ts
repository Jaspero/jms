import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';

@Block({
  label: 'CTA',
  icon: 'view_agenda',
  module: ['pages', 'posts', 'products'],
  previewValue: {
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallToActionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
