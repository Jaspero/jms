import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {map, take, tap} from 'rxjs/operators';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {findModule} from '../../utils/find-module';

@Injectable()
export class CanReadModuleGuard implements CanActivate {
  constructor(
    private state: StateService,
    private ioc: InstanceOverviewContextService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ) {

    let mToUse;
    let loaded = false;

    return this.state.modules$.pipe(
      take(1),
      map(modules => {
        const module = findModule(modules, route.params);

        const documentParams = Object.keys(route.params).reduce((acc, cur) => acc + (cur.startsWith('document') ? 1 : 0), 0);
        /**
         * If there is an even number of document params
         * we're looking at a single document and need to check the
         * get permission. 
         */
        const permission = documentParams % 2 ? 'list' : 'get';

        if (!this.state.permissions[route.params.module]?.[permission]) {
          this.router.navigate(STATIC_CONFIG.dashboardRoute);
          return false;
        }

        mToUse = {...module};

        if (mToUse.id.includes('{docId}')) {

          let it = 0;

          while (mToUse.id.includes('{docId}')) {
            const key = 'document' + (it ? `-${it}` : '');

            if (!route.params[key]) {
              return false;
            }

            mToUse.id = mToUse.id.replace('{docId}', route.params[key])
          }
        }

        if (!this.ioc.module$.getValue()) {
          this.ioc.module$.next(mToUse);
          loaded = true;
        }

        return true;
      }),
      tap(() => {

        if (loaded) {
          return;
        }

        this.ioc.module$.next(mToUse)
      })
    );
  }
}
