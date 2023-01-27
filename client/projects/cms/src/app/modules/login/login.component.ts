import {CommonModule} from '@angular/common';
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
import {
  Auth,
  authState,
  FacebookAuthProvider,
  getMultiFactorResolver,
  GoogleAuthProvider,
  MultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPopup
} from '@angular/fire/auth';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {Router, RouterModule} from '@angular/router';
import {browserLocalPersistence, browserSessionPersistence, MultiFactorError, setPersistence} from '@firebase/auth';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    /**
     * Material
     */
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,

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
export default class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public auth: Auth,
    public fb: FormBuilder,
    private state: StateService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  @ViewChild('password')
  passwordField: ElementRef;

  @ViewChild('mfaVerification')
  mfaVerificationTemp: TemplateRef<any>;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;
  codeForm: FormGroup;
  resolver: MultiFactorResolver;
  verifier: RecaptchaVerifier;
  verificationState: string;
  verificationId: string;
  deviceForm: FormGroup;
  type = 'password';

  errorMap = {
    'auth/wrong-password': 'LOGIN.ERROR_MESSAGE',
    'auth/too-many-requests': 'TOO_MANY_ATTEMPTS_TRY_LATER',
    'auth/user-not-found': 'USER_NOT_FOUND',
    'auth/weak-password': 'WEAK_PASSWORD',
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

  showPassword() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

  loginGoogle() {
    this.setPersistance()
      .pipe(
        switchMap(() =>
          signInWithPopup(this.auth, new GoogleAuthProvider())
        )
      )
      .subscribe({
        error: e => {
          if (e.code === 'auth/multi-factor-auth-required') {
            this.openMfa(e);
          }
        }
      });
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
            this.openMfa(e);
          }
        }
      );
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
            this.openMfa(error);
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
    return from(
      setPersistence(
        this.auth,
        this.loginForm.get('remember').value ? browserLocalPersistence : browserSessionPersistence
      )
    )
      .pipe(
        catchError(e => {
          console.error(e);
          return throwError(e);
        })
      );
  }

  private openMfa(error: MultiFactorError) {
    this.resolver = getMultiFactorResolver(this.auth, error);
    this.verificationState = 'select';

    const hints = this.resolver.hints;

    this.deviceForm = this.fb.group({
      device: hints[hints.length - 1].uid
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
