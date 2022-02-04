import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FileManagerComponent} from '../../modules/dashboard/modules/file-manager/file-manager.component';

@Component({
  selector: 'jms-file-manager-select',
  templateUrl: './file-manager-select.component.html',
  styleUrls: ['./file-manager-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerSelectComponent extends FileManagerComponent implements OnInit {

  dialogRef: MatDialogRef<any>;
  configuration: any;

  ngOnInit() {
    this.dialogRef = (window as any).fileSelect?.dialogRef;
    this.configuration = {
      allowUpload: false,
      uploadMode: true,
      hidePath: true,
      hideFolders: true,
      route: '/',
      ...((window as any).fileSelect?.uploadMethods?.find(method => method.id === 'file-manager')?.configuration || {})
    };
  }
}
