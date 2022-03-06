import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-cp',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  @ViewChild('dg', {static: true})
  passwordDialog: TemplateRef<any>;

  form: FormGroup;
  type = 'password';

  ngOnInit() {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator('Passwords not matching')
      } as AbstractControlOptions
    );
  }

  openDialog() {
    this.dialog.open(
      this.passwordDialog,
      {
        width: '600px'
      }
    )
  }

  showPassword() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

  change() {
    return () => {
      const {password} = this.form.getRawValue();
      const {id} = this.el.nativeElement.dataset;

      return this.dbService.callFunction('cms-updateUser', {id, password})
        .pipe(
          notify({
            success: 'Password updated successfully',
            error: 'There was an error sending the request'
          }),
          tap(() => {
            this.dialog.closeAll();
          })
        )
    }
  }
}
