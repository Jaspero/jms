import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
import {Auth, getIdToken} from '@angular/fire/auth';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ImportModule} from '@definitions';
import {notify} from '@shared/utils/notify.operator';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
import {queue} from '../../shared/utils/queue.operator';

interface ImportResponse {
  errors?: any;
  created?: number;
}

enum ImportType {
  JSON = 'json',
  CSV = 'csv'
}

enum DuplicateHandlingType {
  OVERWRITE = 'overwrite',
  SKIP = 'skip',
  MERGE = 'merge'
}

@Component({
  selector: 'jms-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private fb: FormBuilder,
    private db: DbService,
    private auth: Auth
  ) {
  }

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  @ViewChild('overview', {static: true})
  overview: TemplateRef<any>;

  @ViewChild('dialog', {static: true})
  dialogTemplate: TemplateRef<any>;

  @Input()
  collection: string;

  @Input()
  schema: any;

  @Input()
  importModule: ImportModule;

  importType = ImportType;
  duplicateHandlingType = DuplicateHandlingType;
  data: ImportResponse;
  form: FormGroup;

  selectFile(event) {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    const form = this.form.getRawValue();

    formData.append('data', file, file.name);
    formData.append('collection', this.collection);
    formData.append('schema', JSON.stringify(this.schema));

    if (this.importModule) {
      for (const key in this.importModule) {
        if (this.importModule.hasOwnProperty(key)) {
          formData.append('importModule-' + key, this.importModule[key]);
        }
      }
    }

    event.target.value = '';

    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        formData.append(key, form[key]);
      }
    }

    this.dialog.closeAll();

    from(
      getIdToken(this.auth.currentUser)
    )
      .pipe(
        switchMap(token =>
          this.http
            .post(
              this.db.url('cms-importData'),
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
        ),
        notify({
          success: null,
          error: 'IMPORT.ERROR'
        }),
        queue()
      )
      .subscribe((res: ImportResponse) => {
        this.data = res;
        this.dialog.open(this.overview, {
          width: '500px'
        });
      });
  }

  openDialog() {
    this.form = this.fb.group({
      type: ImportType.CSV,
      delimiter: ',',
      duplicateHandling: DuplicateHandlingType.OVERWRITE,
    });

    this.dialog.open(this.dialogTemplate, {
      width: '500px'
    });
  }
}
