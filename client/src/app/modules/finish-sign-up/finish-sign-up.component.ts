import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {filter, switchMap, take} from 'rxjs/operators';
import {notify} from '../../shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../shared/validators/repeat-password.validator';

@UntilDestroy({checkProperties: true})
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

    this.afAuth.user
      .pipe(
        filter(user => !!user)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  save() {
    return () => {
      const {password} = this.form.getRawValue();

      return this.activatedRoute.queryParams
        .pipe(
          take(1),
          switchMap(({token}) =>
            this.aff.httpsCallable('cms-finishSignUp')({token, password})
          ),
          switchMap(data =>
            this.afAuth.signInWithEmailAndPassword(data.email, password)
          ),
          notify({
            success: 'FINISH_SIGN_UP.SIGN_UP_SUCCESSFUL'
          })
        )
    }
  }
}
