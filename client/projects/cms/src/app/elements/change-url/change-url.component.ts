import {ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {notify} from '@shared/utils/notify.operator';
import {forkJoin, switchMap, tap} from 'rxjs';
import {DbService} from '../../shared/services/db/db.service';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-change-url',
  templateUrl: './change-url.component.html',
  styleUrls: ['./change-url.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeUrlComponent {
  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  @ViewChild('d', {static: true})
  dTemplate: TemplateRef<any>;

  @Input() id: string;
  @Input() collection: string;

  form: FormGroup;

  change() {

    this.form = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9\-\_]*$')]]
    });

    this.dialog.open(
      this.dTemplate,
      {
        width: '500px'
      }
    )
  }

  save() {
    return () => {
      const {url} = this.form.getRawValue();

      return this.db.getDocument(this.collection, this.id)
        .pipe(
          switchMap(doc => {
            const {id, ...dt} = doc;
            return forkJoin([
              this.db.setDocument(this.collection, url, dt),
              this.db.removeDocument(this.collection, this.id)
            ]);
          }),
          notify({
            success: 'URL_CHANGED_SUCCESSFULLY'
          }),
          tap(() =>
            this.dialog.closeAll()
          )
        )
    }
  }
}
