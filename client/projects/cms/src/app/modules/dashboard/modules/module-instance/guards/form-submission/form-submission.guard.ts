import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Module} from '../../../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {queue} from '../../../../../../shared/utils/queue.operator';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';

@Injectable()
export class FormSubmissionGuard implements CanActivate {
  constructor(
    private state: StateService,
    private router: Router,
    private db: DbService,
    private ioc: InstanceOverviewContextService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ) {
    const {id} = route.params;
    return this.db.getDocument('forms', id)
      .pipe(
        queue(),
        map(doc => {

          this.ioc.module$ = of({
            id: `forms/${doc.id}/submissions`,
            name: `Forms - ${doc.name}`,
            layout: {
              sort: {active: 'createdOn', direction: 'desc'},
              table: {
                tableColumns: [
                  {
                    key: '/createdOn',
                    label: 'Created On',
                    pipe: ['date']
                  },
                  ...doc.fields.map(it => ({
                    key: `/${it.id}`,
                    label: it.label
                  }))
                ],
                hideAdd: ['admin'],
                hideImport: ['admin'],
                hideEdit: ['admin']
              },
              overview: {
                toolbar: []
              }
            }
          } as Module);

          return true;
        })
      );
  }
}
