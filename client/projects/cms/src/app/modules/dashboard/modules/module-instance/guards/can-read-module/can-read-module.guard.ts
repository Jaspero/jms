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
    console.log('route', route);
    return this.state.modules$.pipe(
      map(modules => {
        const module = findModule(modules, route.params);

        console.log('module', module);

        if (
          !module ||
          module.authorization &&
          module.authorization.read &&
          !module.authorization.read.includes(this.state.role)
        ) {
          this.router.navigate(STATIC_CONFIG.dashboardRoute);
          return false;
        }

        this.ioc.module$.next(module);
        this.state.page$.next({module: {id: module.id, name: module.name}});
        return true;
      }),
      take(1),
    );
  }
}
