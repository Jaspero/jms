import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, sendPasswordResetEmail} from '@angular/fire/auth';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Router, RouterModule} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {notify} from '@shared/utils/notify.operator';
import {from, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';

@Component({
  selector: 'jms-trigger-password-reset',
  templateUrl: './trigger-password-reset.component.html',
  styleUrls: ['./trigger-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    /**
     * Material
     */
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ],
  standalone: true
})
export default class TriggerPasswordResetComponent implements OnInit {
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private auth: Auth
  ) {
  }

  form: FormGroup;
  staticConfig = STATIC_CONFIG;
  errorMap = {
    'auth/too-many-requests': 'TOO_MANY_ATTEMPTS_TRY_LATER',
    'auth/user-not-found': 'USER_NOT_FOUND'
  };

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
          catchError(error => 
            throwError(() => ({
              message: this.errorMap[error.code] || 'RESET_PASSWORD.ERROR_MESSAGE'
            }))
          ),
          notify({
            success: 'RESET_PASSWORD.SUCCESS_MESSAGE'
          })
        );
  }
}
