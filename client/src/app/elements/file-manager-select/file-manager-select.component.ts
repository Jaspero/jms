import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

  ngOnInit(): void {
    this.dialogRef = (window as any).fileSelectDialogRef;
  }

}
