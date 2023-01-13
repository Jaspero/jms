import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {applyActionCode, Auth, checkActionCode, multiFactor, MultiFactorUser, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier, signOut} from '@angular/fire/auth';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {from, Subscription, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {COUNTRIES} from '../../shared/consts/countries.const';

@UntilDestroy()
@Component({
  selector: 'jms-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,

    /**
     * Material
     */
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule,
    MatDialogModule
  ],
  standalone: true
})
export default class AuthenticationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private dialog: MatDialog
  ) {
  }

  @ViewChild('verificationDialog', {static: true})
  verificationDialogTemp: TemplateRef<any>;

  form: FormGroup;
  oobCode: string;
  countries = COUNTRIES;

  recaptcha: RecaptchaVerifier;
  mfa: MultiFactorUser;
  codeForm: FormGroup;
  prefix: string;
  confirmationResult: string;

  private subscription: Subscription;

  ngOnInit() {
    this.oobCode = this.activatedRoute.snapshot.queryParams.oobCode;

    if (!this.oobCode) {
      this.router.navigate(STATIC_CONFIG.loginRoute);
    }

    this.form = this.fb.group({
      countryCode: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.form.get('countryCode')
      .valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(code => {
        this.prefix = COUNTRIES.find(country => country.code === code).phonePrefix;

        this.auth.languageCode = code;

        if (!this.recaptcha) {
          this.recaptcha = new RecaptchaVerifier('mfa-submit', {
            size: 'invisible',
            callback: () => this.submit()
          }, this.auth);

          this.recaptcha.render();
        }

        this.cdr.markForCheck();
      });
  }

  submit() {
    this.subscription = from(
      checkActionCode(this.auth, this.oobCode)
    )
      .pipe(
        switchMap(() =>
          applyActionCode(this.auth, this.oobCode)
        ),
        switchMap(user => {
          this.mfa = multiFactor(this.auth.currentUser)
          return this.mfa.getSession();
        }),
        switchMap(session => {

          const {phone} = this.form.getRawValue();

          const phoneAuthProvider = new PhoneAuthProvider(this.auth);
          return phoneAuthProvider.verifyPhoneNumber({phoneNumber: this.prefix + phone, session}, this.recaptcha);
        }),
        catchError(e => {
          if (e.code === 'auth/requires-recent-login') {
            this.router.navigate(STATIC_CONFIG.loginRoute);
            signOut(this.auth);
          }

          return throwError(() => e);
        }),
        notify({
          success: false,
          showThrownError: true
        })
      )
      .subscribe((verificationId) => {

        this.recaptcha.clear();
        this.recaptcha = null;

        this.subscription.unsubscribe();

        this.confirmationResult = verificationId;

        this.codeForm = this.fb.group({
          code: ['', Validators.required]
        });

        this.dialog.open(this.verificationDialogTemp, {
          width: '400px'
        });
      });
  }

  verify() {
    return () => {
      const {code} = this.codeForm.getRawValue();
      const cred = PhoneAuthProvider.credential(this.confirmationResult, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      return from(
        this.mfa.enroll(multiFactorAssertion, 'Phone Number')
      )
        .pipe(
          notify(),
          tap(() => {
            this.dialog.closeAll();
            this.router.navigate(STATIC_CONFIG.dashboardRoute);
          })
        );
    };
  }
}
