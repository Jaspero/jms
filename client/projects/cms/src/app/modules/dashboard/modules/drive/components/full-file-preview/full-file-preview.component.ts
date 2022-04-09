import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {DriveItem} from 'definitions';
import {PreviewType} from '../../types/preview.type';
import {detectPreviewType} from '../../utils/detect-preview-type';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'jms-full-file-preview',
  templateUrl: './full-file-preview.component.html',
  styleUrls: ['./full-file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullFilePreviewComponent implements OnInit {

  type: PreviewType = 'other';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { item: DriveItem }
  ) {
  }

  ngOnInit(): void {
    this.type = detectPreviewType(this.data.item.contentType);

    console.log(this.data);
  }
}
