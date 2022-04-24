import {Injectable} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {notify} from '@shared/utils/notify.operator';
import {verifyPasswordResetCode} from 'firebase/auth';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {from, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class HasCodeGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.oobCode) {
      return from(
        verifyPasswordResetCode(this.auth, route.queryParams.oobCode)
      )
        .pipe(
          map(() => true),
          notify({
            success: false,
            error: 'INVALID_OOB_CODE'
          }),
          catchError(() => {
            this.router.navigate(STATIC_CONFIG.loginRoute);
            return of(false)
          })
        );
    }

    this.router.navigate(STATIC_CONFIG.loginRoute);
    return of(false)
  }
}
