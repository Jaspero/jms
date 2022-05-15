import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, confirmPasswordReset} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
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

  ngOnInit() {

    this.code = this.activatedRoute.snapshot.queryParams.oobCode;

    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator('')
      } as AbstractControlOptions
    );
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
          notify({
            success: 'RESET_SUCCESSFUL'
          }),
          tap(() =>
            this.router.navigate(STATIC_CONFIG.loginRoute)
          )
        );
  }
}
