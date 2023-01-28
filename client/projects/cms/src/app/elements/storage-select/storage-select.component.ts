import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FileSelectConfiguration} from '../../modules/dashboard/modules/storage/types/file-select-configuration.interface';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-storage-select',
  templateUrl: './storage-select.component.html',
  styleUrls: ['./storage-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageSelectComponent implements OnInit {

  dialogRef: MatDialogRef<any>;
  configuration: FileSelectConfiguration;

  ngOnInit() {
    this.dialogRef = (window as any).fileSelect?.dialogRef;
    this.configuration = {
      allowUpload: false,
      uploadMode: true,
      hidePath: true,
      hideFolders: true,
      route: '/public',
      minPath: '/public',
      ...((window as any).fileSelect?.uploadMethods?.find(method => method.id === 'file-manager')?.configuration || {})
    };
  }
}
