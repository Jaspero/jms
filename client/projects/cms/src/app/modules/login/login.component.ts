import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Auth, authState, FacebookAuthProvider, GoogleAuthProvider, MultiFactorResolver, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier, setPersistence, signInWithEmailAndPassword, signInWithPopup} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {from, of, throwError} from 'rxjs';
import {catchError, filter, switchMap, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {StateService} from '../../shared/services/state/state.service';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'jms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public auth: Auth,
    public fb: FormBuilder,
    private state: StateService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
  }

  @ViewChild('password', {static: true})
  passwordField: ElementRef;

  @ViewChild('mfaVerification', {static: true})
  mfaVerificationTemp: TemplateRef<any>;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;
  codeForm: FormGroup;
  resolver: MultiFactorResolver;
  verifier: RecaptchaVerifier;
  verificationState: string;
  verificationId: string;
  deviceForm: FormGroup;

  errorMap = {
    'auth/wrong-password': 'LOGIN.ERROR_MESSAGE',
    'auth/too-many-requests': 'LOGIN.TOO_MANY_ATTEMPTS_TRY_LATER',
    'auth/user-not-found': 'LOGIN.USER_NOT_FOUND'
  };

  ngOnInit() {
    /**
     * Makes sure roles aren't preserved
     * between logout/login
     */
    this.state.role = null;

    authState(this.auth)
      .pipe(
        filter(user => !!user)
      )
      .subscribe(() => {

        if (this.state.entryPath) {
          this.router.navigateByUrl(this.state.entryPath);
          delete this.state.entryPath;
          return;
        }

        this.router.navigate(STATIC_CONFIG.dashboardRoute);
      });

    this.buildForm();
  }

  loginGoogle() {

    this.setPersistance()
      .pipe(
        switchMap(() =>
          signInWithPopup(this.auth, new GoogleAuthProvider())
        )
      )
      .subscribe(
        () => {},
        e => {
          if (e.code === 'auth/multi-factor-auth-required') {
            this.openMfa(e.resolver);
          }
        }
      )
  }

  loginFacebook() {

    this.setPersistance()
      .pipe(
        switchMap(() =>
          signInWithPopup(this.auth, new FacebookAuthProvider())
        )
      )
      .subscribe(
        () => {},
        e => {
          if (e.code === 'auth/multi-factor-auth-required') {
            this.openMfa(e.resolver);
          }
        }
      )
  }

  loginEmail() {
    return () => {
      const data = this.loginForm.getRawValue();

      return this.setPersistance().pipe(
        switchMap(() =>
          from(
            signInWithEmailAndPassword(
              this.auth,
              data.emailLogin,
              data.passwordLogin
            )
          )
        ),
        catchError(error => {
          if (error.code === 'auth/multi-factor-auth-required') {
            this.openMfa(error.resolver);
            return of(true);
          } else {
            this.loginForm.get('passwordLogin').reset();
            this.passwordField.nativeElement.focus();
          }

          return throwError(() => ({
            message: this.errorMap[error.code] || 'LOGIN.ERROR_MESSAGE'
          }))
            .pipe(
              notify()
            );
        }),
      );
    };
  }

  verifyMfa() {
    return () => {

      const {code} = this.codeForm.getRawValue();

      return from(
        this.resolver.resolveSignIn(
          PhoneMultiFactorGenerator.assertion(
            PhoneAuthProvider.credential(this.verificationId, code)
          )
        )
      )
        .pipe(
          tap(() => {
            this.dialog.closeAll();
          }),
          notify({
            success: false,
            showThrownError: true
          })
        );
    };
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required],
      remember: true
    });
  }

  private setPersistance() {
    return from(setPersistence(
      this.auth,
      this.loginForm.get('remember').value ? 'LOCAL' : 'SESSION' as any
    ))
  }

  private openMfa(resolver: MultiFactorResolver) {

    this.resolver = resolver;
    this.verificationState = 'select';

    this.deviceForm = this.fb.group({
      device: resolver.hints[resolver.hints.length - 1].uid
    });

    this.dialog.open(
      this.mfaVerificationTemp,
      {
        width: '400px'
      }
    )
      .afterOpened()
      .subscribe(() => {
        this.verifier = new RecaptchaVerifier('mfa-submit', {
          size: 'invisible',
          callback: () => {
            this.codeForm = this.fb.group({
              code: ['', Validators.required]
            });

            const {device} = this.deviceForm.getRawValue();

            const verify = () => from(
              new PhoneAuthProvider(this.auth)
                .verifyPhoneNumber(
                  {
                    multiFactorHint: this.resolver.hints.find(hint => hint.uid === device),
                    session: this.resolver.session
                  },
                  this.verifier
                )
            );

            verify()
              .pipe(
                catchError(e => {
                  this.verifier.clear();
                  return verify();
                })
              )
              .subscribe(vId => {
                this.zone.run(() => {
                  this.verificationId = vId;
                  this.verificationState = 'submit';
                  this.cdr.markForCheck();
                });
              });
          }
        }, this.auth);

        this.verifier.render();
      });
  }
}
