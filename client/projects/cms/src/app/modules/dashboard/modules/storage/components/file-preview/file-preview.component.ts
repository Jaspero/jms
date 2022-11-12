import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {StorageItem} from '@definitions';
import {detectPreviewType} from '../../utils/detect-preview-type';
import {PreviewType} from '../../types/preview.type';

@Component({
  selector: 'jms-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePreviewComponent implements OnInit {

  @Input() file: StorageItem;

  type: PreviewType = 'other';

  ngOnInit() {
    this.type = detectPreviewType(this.file.contentType);
  }
}
