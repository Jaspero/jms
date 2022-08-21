import {Injectable} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {verifyPasswordResetCode} from 'firebase/auth';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {from, of} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';
import {StateService} from '../../../../shared/services/state/state.service';

@Injectable()
export class HasCodeGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private state: StateService
  ) {}

  errorMap = {
    'auth/invalid-action-code': 'INVALID_ACTION_CODE',
  };

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.oobCode) {
      return from(
        verifyPasswordResetCode(this.auth, route.queryParams.oobCode)
      )
        .pipe(
          map(() => true),
          catchError(error => {

            /**
             * SnackBar invoked directly rather then through notify
             * because an error is thrown before route change.
             */
            this.state.translationsReady$
              .pipe(
                take(1)
              )
              .subscribe(() =>
                this.snackBar.open(
                  this.transloco.translate(this.errorMap[error.code] || 'INVALID_ACTION_CODE'),
                  this.transloco.translate('DISMISS'),
                  {
                    panelClass: 'snack-bar-error',
                    duration: 5000
                  }
                )
              );

            this.router.navigate(STATIC_CONFIG.loginRoute);
            return of(true);
          })
        );
    }

    this.router.navigate(STATIC_CONFIG.loginRoute);

    return of(false)
  }
}
