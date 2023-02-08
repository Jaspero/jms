import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Block, BlockData, BlockDataOptions} from '@jaspero/fb-page-builder';

export interface ParagraphOptions extends BlockDataOptions {
  value: string;
}

@Block({
  label: 'PARAGRAPH',
  icon: 'title',
  module: ['automatic-emails'],
  previewValue: {
    value: `<p>This is some content.</p>`
  },
  form: {
    schema: {
      properties: {
        value: {type: 'string'}
      }
    },
    definitions: {},
    segments: []
  }
})
@Component({
  selector: 'jms-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParagraphComponent extends BlockData<ParagraphOptions> {}
