import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {StorageItem} from '@definitions';
import {PreviewType} from '../../types/preview.type';
import {detectPreviewType} from '../../utils/detect-preview-type';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StorageService} from '../../services/storage/storage.service';

@Component({
  selector: 'jms-full-file-preview',
  templateUrl: './full-file-preview.component.html',
  styleUrls: ['./full-file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullFilePreviewComponent implements OnInit {

  type: PreviewType = 'other';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {item: StorageItem},
    public storage: StorageService,
    public dialogRef: MatDialogRef<FullFilePreviewComponent>
  ) {
  }

  ngOnInit(): void {
    this.type = detectPreviewType(this.data.item.contentType);
  }
}
