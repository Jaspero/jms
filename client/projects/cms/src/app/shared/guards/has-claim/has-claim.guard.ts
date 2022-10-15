import {Injectable} from '@angular/core';
import {Auth, authState, getIdTokenResult, signOut} from '@angular/fire/auth';
import {CanActivate, Router} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {notify} from '@shared/utils/notify.operator';
import {Collections} from '@definitions';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class HasClaimGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private state: StateService,
    private router: Router,
    private db: DbService,
    private transloco: TranslocoService
  ) {}

  canActivate(): Observable<boolean> {
    if (this.state.role) {
      return of(true);
    }

    return authState(this.auth)
      .pipe(
        take(1),
        switchMap(user => getIdTokenResult(user)),
        switchMap(data => {
          if (
            STATIC_CONFIG.dashboardRoles.length &&
            (!data || !data.claims.role || !STATIC_CONFIG.dashboardRoles.includes(data.claims.role))
          ) {
            return throwError(
              () =>
                this.transloco.translate('DASHBOARD_ACCESS_DENIED')
            );
          }

          const {user_id, role} = data.claims as any;

          this.state.role = role;

          return forkJoin([
            this.db.getDocument(Collections.Users, user_id),
            this.db.getDocument([Collections.Users, user_id, 'authorization'].join('/'), 'permissions')
          ]);
        }),
        map(([user, permissions]) => {
          this.state.permissions = permissions;
          this.state.user = user;
          return true;
        }),
        catchError(e => this.signOut(e)),
        notify({
          showThrownError: true,
          success: false
        })
      );
  }

  signOut(error: Error) {
    signOut(this.auth)
      .then()
      .catch()
      .finally(() => {
        this.router.navigate(STATIC_CONFIG.loginRoute);
      });

    return throwError(() => error);
  }
}
