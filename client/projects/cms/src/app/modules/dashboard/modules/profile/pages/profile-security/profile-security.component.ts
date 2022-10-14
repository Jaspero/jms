import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, authState, deleteUser, multiFactor, sendEmailVerification, signOut, unlink, updateEmail, updatePassword, User} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {Collections} from '@definitions';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {combineLatest, from, Observable, throwError} from 'rxjs';
import {catchError, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {confirmation} from '../../../../../../shared/utils/confirmation';

@Component({
  selector: 'jms-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSecurityComponent implements OnInit {
  constructor(
    private state: StateService,
    private auth: Auth,
    private fb: FormBuilder,
    private router: Router,
    private db: DbService
  ) {}

  multipleProviders$: Observable<boolean>;
  passwordProvider$: Observable<any>;
  googleProvider$: Observable<any>;
  hasTwoFactor$: Observable<boolean>;

  pwForm: FormGroup;
  emailForm: FormGroup;

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: [this.state.user.email || '', [Validators.required, Validators.email]]
    });

    const state: Observable<User> = authState(this.auth)
      .pipe(
        shareReplay(1)
      );

    this.multipleProviders$ = state
      .pipe(
        map(item => item?.providerData?.length > 1)
      );

    this.hasTwoFactor$ = state
      .pipe(
        map(() =>
          !!(multiFactor(this.auth.currentUser)?.enrolledFactors?.length)
        ),
        shareReplay(1)
      );

    this.googleProvider$ = state
      .pipe(
        map(item =>
          (item?.providerData || [])
            .find(it => it.providerId === 'google.com')
        )
      );

    this.passwordProvider$ = state
      .pipe(
        map(item =>
          (item.providerData || [])
            .find(it => it.providerId === 'password')
        )
      );

    this.pwForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator(`Passwords don't match`)
      } as AbstractControlOptions);
  }

  changePassword(form: FormGroupDirective) {
    return () =>
      from(
        updatePassword(
          this.auth.currentUser,
          this.pwForm.get('password').value
        )
      )
        .pipe(
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'For security reasons please login to your account again before changing your password.';
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
            success: 'Your password has been updated successfully'
          }),
          tap(() => {
            form.reset();
          })
        );
  }

  changeEmail() {
    return () => {
      const {email} = this.emailForm.getRawValue();

      return combineLatest([
        this.db.setDocument(
          Collections.Users,
          this.state.user.id,
          {email},
          {merge: true}
        ),
        from(
          updateEmail(this.auth.currentUser, email)
        )
          .pipe(
            catchError(err => {
              let message;

              if (err.code === 'auth/requires-recent-login') {
                message = 'For security reasons please login to your account again before changing your email.';
                this.signOut();
              }

              return throwError(() => ({
                error: {
                  message
                }
              }));
            })
          )
      ])
        .pipe(
          notify({
            success: 'Your email has been updated successfully'
          })
        );
    };
  }

  removeAccount() {
    confirmation(
      [
        switchMap(() => from(deleteUser(this.auth.currentUser))),
        catchError(error => {
          if (error.code === 'auth/requires-recent-login') {
            this.signOut();
          }

          return throwError(() => ({
            error: {
              message:
                'For security reasons, please login again before removing your account.'
            }
          }));
        }),
        notify({
          success: 'Your account and all of your personal information have been removed from our system.'
        }),
        tap(() => {
          this.router.navigate(STATIC_CONFIG.loginRoute);
        })
      ],
      {
        header: 'Are you sure you want to remove your account?',
        description:
          'This action is permanent and can not be reverted. Your account and all of your personal information will be removed from our system.'
      }
    );
  }

  removeProvider(provider: string) {
    confirmation(
      [
        switchMap(() =>
          unlink(this.auth.currentUser, provider)
        ),
        notify({
          success: 'Your account has been successfully unlinked.'
        })
      ],
      {
        header: 'Are you sure you want to unlink this authentication method?',
        description:
          'This action is permanent and can not be reverted. You would need to link your account again in order to be able to use this authentication method.'
      }
    );
  }

  toggleTwoFactor() {
    return () => {
      let htf: boolean;

      return this.hasTwoFactor$
        .pipe(
          take(1),
          switchMap((hasTwoFactor) => {
            htf = hasTwoFactor;
            return authState(this.auth)
              .pipe(
                take(1),
                switchMap(() =>
                  from(
                    hasTwoFactor ?
                      multiFactor(this.auth.currentUser).unenroll(multiFactor(this.auth.currentUser).enrolledFactors.pop()) :
                      sendEmailVerification(this.auth.currentUser, {url: `${location.origin}/mfa`})
                  )
                ),
                catchError(e => {
                  if (e.code === 'auth/requires-recent-login') {
                    this.signOut();
                  }

                  return throwError(() => e);
                }),
                notify({
                  success: htf ? 'REMOVE_MFA' : 'CONNECT_MFA',
                  showThrownError: true
                })
              );
          })
        );
    };
  }

  signOut() {
    signOut(this.auth)
      .then(() =>
        this.router.navigate(STATIC_CONFIG.loginRoute)
      );
  }
}
