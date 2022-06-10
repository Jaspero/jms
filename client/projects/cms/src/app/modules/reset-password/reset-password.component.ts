import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, confirmPasswordReset} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {from, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';

@Component({
  selector: 'jms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: Auth
  ) {
  }

  form: FormGroup;
  staticConfig = STATIC_CONFIG;
  code: string;
  loginUrl = STATIC_CONFIG.loginRoute;
  errorMap = {
    'auth/invalid-action-code': 'INVALID_ACTION_CODE',
  };

  ngOnInit() {

    this.code = this.activatedRoute.snapshot.queryParams.oobCode;

    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator('')
      } as AbstractControlOptions
    );

    this.form.valueChanges.subscribe(a => console.log(this.form))
  }

  reset() {
    return () =>
      from(
        confirmPasswordReset(
          this.auth,
          this.code,
          this.form.get('password').value
        )
      )
        .pipe(
          catchError(error => 
            throwError(() => ({
              message: this.errorMap[error.code] || 'RESET_PASSWORD.ERROR_MESSAGE'
            }))
          ),
          notify({
            success: 'RESET_SUCCESSFUL'
          }),
          tap(() =>
            this.router.navigate(STATIC_CONFIG.loginRoute)
          )
        );
  }
}
