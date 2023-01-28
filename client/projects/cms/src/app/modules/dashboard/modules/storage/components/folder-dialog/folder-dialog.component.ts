import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {random} from '@jaspero/utils';
import {tap} from 'rxjs';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {STORAGE_COLORS} from '../../consts/storage-colors.const';

@Component({
  selector: 'jms-folder-dialog',
  templateUrl: './folder-dialog.component.html',
  styleUrls: ['./folder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      folder: any,
      path: string,
      userId: string
    },
    private fb: FormBuilder,
    private db: DbService,
    private dialogRef: MatDialogRef<FolderDialogComponent>
  ) { }

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.folder.name || '', Validators.required],
      color: [this.data.folder.color || STORAGE_COLORS[0].value, Validators.required],
      icon: [this.data.folder.icon || 'folder', Validators.required],
      description: this.data.folder.description || ''
    });
  }

  save() {
    return () => {

      const data = this.form.getRawValue();

      if (this.data.folder.id) {

        this.data.folder = {
          ...this.data.folder,
          ...data
        };

        return this.db.setDocument('storage', this.data.folder.id, data, {merge: true})
          .pipe(
            tap(() =>
              this.dialogRef.close(this.data.folder)
            )
          );
      }

      return this.db.setDocument('storage', `fo-${random.string(20)}`, {
        ...data,
        path: this.data.path,
        type: 'folder',
        metadata: {
          ['permissions_users_' + this.data.userId + '_write']: 'true'
        },
        contentType: 'text/plain',
        createdOn: Date.now(),
        size: 0
      }, {})
        .pipe(
          tap(() =>
            this.dialogRef.close({name: data.name})
          )
        );
    }
  }
}
