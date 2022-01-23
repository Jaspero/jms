import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, sendPasswordResetEmail} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {notify} from '@shared/utils/notify.operator';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';

@Component({
  selector: 'jms-trigger-password-reset',
  templateUrl: './trigger-password-reset.component.html',
  styleUrls: ['./trigger-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriggerPasswordResetComponent implements OnInit {
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private auth: Auth
  ) {
  }

  form: FormGroup;
  staticConfig = STATIC_CONFIG;

  ngOnInit() {
    this.form = this.fb.group({
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
  }

  reset() {
    return () =>
      from(
        sendPasswordResetEmail(
          this.auth,
          this.form.get('email').value,
          {
            url: `${location.origin}/reset-password`
          }
        )
      )
        .pipe(
          tap(() => {
            this.form.reset();
            this.form.markAsPristine();
          }),
          notify({
            success: 'RESET_PASSWORD.SUCCESS_MESSAGE',
            error: 'RESET_PASSWORD.ERROR_MESSAGE'
          })
        );
  }
}
