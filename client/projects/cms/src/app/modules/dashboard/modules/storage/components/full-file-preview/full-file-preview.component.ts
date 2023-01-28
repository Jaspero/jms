import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {StorageItem} from '@definitions';
import {StorageService} from '../../services/storage/storage.service';
import {PreviewType} from '../../types/preview.type';
import {detectPreviewType} from '../../utils/detect-preview-type';

@Component({
  selector: 'jms-full-file-preview',
  templateUrl: './full-file-preview.component.html',
  styleUrls: ['./full-file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullFilePreviewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {item: StorageItem},
    public storage: StorageService,
    public dialogRef: MatDialogRef<FullFilePreviewComponent>
  ) {
  }

  type: PreviewType = 'other';

  ngOnInit() {
    this.type = detectPreviewType(this.data.item.contentType);
  }
}
