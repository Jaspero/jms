import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {STATIC_CONFIG} from 'projects/cms/src/environments/static-config';
import {map, take} from 'rxjs/operators';
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
    return this.state.modules$.pipe(
      map(modules => {
        const module = findModule(modules, route.params);

        if (
          !module ||
          module.authorization &&
          module.authorization.read &&
          !module.authorization.read.includes(this.state.role)
        ) {
          this.router.navigate(STATIC_CONFIG.dashboardRoute);
          return false;
        }

        const mToUse = {...module};

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

        this.ioc.module$.next(mToUse);
        this.state.page$.next({module: {id: mToUse.id, name: mToUse.name}});
        return true;
      }),
      take(1),
    );
  }
}
