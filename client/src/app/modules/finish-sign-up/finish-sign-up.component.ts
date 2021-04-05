import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import firebase from 'firebase/app';
import {from, throwError} from 'rxjs';
import {catchError, switchMap, take, tap} from 'rxjs/operators';
import {notify} from '../../shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../shared/validators/repeat-password.validator';

@Component({
  selector: 'jms-finish-sign-up',
  templateUrl: './finish-sign-up.component.html',
  styleUrls: ['./finish-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishSignUpComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private aff: AngularFireFunctions,
    private afAuth: AngularFireAuth,
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
      }
    );
  }

  save() {
    return () => {
      const {password} = this.form.getRawValue();

      return this.activatedRoute.queryParams
        .pipe(
          take(1),
          switchMap(({token}) =>
            this.afAuth.signInWithCustomToken(token)
          ),
          switchMap(() =>
            from(
              firebase.auth()
                .currentUser
                .updatePassword(password)
            )
          ),
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'For security reasons please login to your account again before changing your password.';
              firebase.auth()
                .signOut()
                .then(() =>
                  this.router.navigate(['/login'])
                );
            }

            return throwError({
              error: {
                message
              }
            });
          }),
          notify({
            success: 'FINISH_SIGN_UP.SIGN_UP_SUCCESSFUL'
          }),
          tap(() =>
            this.router.navigate(['/dashboard'])
          ),
        )
    }
  }
}
