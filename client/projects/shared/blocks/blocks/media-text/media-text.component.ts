import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';

@Block({
  label: 'MEDIA_TEXT',
  icon: 'article',
  module: ['pages', 'posts', 'products'],
  previewValue: {},
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
  selector: 'jms-media-text',
  templateUrl: './media-text.component.html',
  styleUrls: ['./media-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaTextComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
