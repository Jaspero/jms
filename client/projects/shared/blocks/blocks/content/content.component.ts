import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonBlockComponent, CommonOptions} from '@shared/blocks/blocks/common.block';

interface ContentOptions extends CommonOptions {
  content: string;
}

@Component({
  selector: 'jms-content',
  templateUrl: './content.component.html',
  styleUrls: [
    '../common-styles.scss',
    './content.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent extends CommonBlockComponent {
  @Input()
  data: ContentOptions;
}
