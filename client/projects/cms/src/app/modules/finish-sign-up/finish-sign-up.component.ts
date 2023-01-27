import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, signInWithCustomToken, updatePassword} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {signOut} from 'firebase/auth';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {from, throwError} from 'rxjs';
import {catchError, switchMap, take, tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';

@Component({
  selector: 'jms-finish-sign-up',
  templateUrl: './finish-sign-up.component.html',
  styleUrls: ['./finish-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,

    /**
     * Material
     */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,

    /**
     * Ng helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ],
  standalone: true
})
export default class FinishSignUpComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private db: DbService,
    private auth: Auth,
    private router: Router
  ) { }

  form: FormGroup;

  ngOnInit() {
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

  save() {
    return () => {
      const {password} = this.form.getRawValue();

      return this.activatedRoute.queryParams
        .pipe(
          take(1),
          switchMap(({t}) =>
            this.db.callFunction('cms-exchangeToken', {token: t, pullUser: false})
          ),
          switchMap(({token}) =>
            signInWithCustomToken(this.auth, token)
          ),
          switchMap(() =>
            from(
              updatePassword(this.auth.currentUser, password)
            )
          ),
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'REQUIRES_RECENT_LOGIN';
              signOut(this.auth)
                .then(() =>
                  this.router.navigate(STATIC_CONFIG.loginRoute)
                );
            }

            return throwError(() => ({
              error: {
                message
              }
            }));
          }),
          notify({
            success: 'SIGN_UP_SUCCESSFUL'
          }),
          tap(() =>
            this.router.navigate(STATIC_CONFIG.dashboardRoute)
          ),
        );
    };
  }
}
