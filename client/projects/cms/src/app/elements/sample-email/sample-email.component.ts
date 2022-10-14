import {Component, ChangeDetectionStrategy, Input, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {notify} from '@shared/utils/notify.operator';
import {tap} from 'rxjs/operators';
import {Collections} from '@definitions';
import {DbService} from '../../shared/services/db/db.service';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-sample-email',
  templateUrl: './sample-email.component.html',
  styleUrls: ['./sample-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleEmailComponent {
  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  @ViewChild('dg', {static: true}) dialogRef: TemplateRef<any>;
  @Input() id: string;

  form: FormGroup;
  fields: Array<{id: string; name: string}>;

  open() {
    return () => this.db.getDocument(Collections.AutomaticEmails, this.id)
      .pipe(
        tap(data => {

          this.fields = [];

          const group: any = {};

          if (data.dynamicValues) {
            Object.keys(data.dynamicValues)
              .forEach(id => {
                this.fields.push({id, name: id});
                group[id] = new FormControl('');
              });
          }

          this.form = this.fb.group({
            email: ['', Validators.required],
            data: this.fb.group(group)
          });
          this.dialog.open(this.dialogRef, {width: '600px'});
        })
      );
  }

  send() {
    return () => {

      const {data, email} = this.form.getRawValue();

      return this.db.callFunction('cms-sampleEmail', {
        id: this.id,
        data,
        email
      })
        .pipe(
          notify()
        );
    };
  }
}
