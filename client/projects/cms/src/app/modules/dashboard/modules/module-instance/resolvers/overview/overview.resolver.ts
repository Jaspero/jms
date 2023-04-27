import {SelectionModel} from '@angular/cdk/collections';
import {Injectable, Injector} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import {ModuleOverviewView} from '@definitions';
import {Parser} from '@jaspero/form-builder';
import {BehaviorSubject, combineLatest, first, map, Observable, shareReplay, startWith, Subject, switchMap, tap} from 'rxjs';
import {DEFAULT_PAGE_SIZE} from '../../../../../../shared/consts/page-sizes.const';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {OverviewService} from '../../interfaces/overview-service.interface';
import {DefaultOverviewService} from '../../services/default-overview.service';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {getCurrentView} from '../../utils/get-current-view';

export interface InstanceOverviewData {
  currentView: string;
  activeView: string;
  showViewSelector: boolean;
  name: string;
  views: ModuleOverviewView[];
  toolbar: string[];
  hideAdd: boolean;
  overviewService: OverviewService;
}

@Injectable()
export class OverviewResolver implements Resolve<InstanceOverviewData> {
  constructor(
    private ioc: InstanceOverviewContextService,
    private injector: Injector,
    private state: StateService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InstanceOverviewData> {
    return this.ioc.module$
      .pipe(
        first(),
        map(module => {
          const defaultData = {
            pageSize: null,
            sort: null,
            filter: null,
            search: ''
          };

          const overviewData: InstanceOverviewData = {
            overviewService: this.injector.get(module.layout?.overview?.service || DefaultOverviewService),
            name: module.name,
            showViewSelector: false,
            views: [],
            toolbar: ['add'],
            activeView: 'table',
            currentView: getCurrentView('table'),
            hideAdd: false
          };

          this.state.restoreRouteData(defaultData, state.url, route.queryParams);

          this.ioc.routeData = this.state.getRouterData(defaultData, state.url);
          this.ioc.pageSize = new FormControl(this.ioc.routeData.pageSize || DEFAULT_PAGE_SIZE);
          this.ioc.emptyState$ = new BehaviorSubject(false);
          this.ioc.filterChange$ = new BehaviorSubject(this.ioc.routeData.filter);
          this.ioc.sortChange$ = new BehaviorSubject(this.ioc.routeData.sort);
          this.ioc.searchControl = new FormControl(this.ioc.routeData.search);
          this.ioc.hasMore$ = new BehaviorSubject(false);
          this.ioc.loadMore$ = new Subject<boolean>();
          this.ioc.selection = new SelectionModel<string>(true, []);

          if (module.layout) {

            if (module.layout.pageSize && !this.ioc.routeData.pageSize) {
              this.ioc.pageSize.setValue(module.layout.pageSize);
            }

            if (module.layout.sort && !this.ioc.routeData.sort) {
              this.ioc.sortChange$.next(module.layout.sort);
            }

            if (module.layout.filterModule && module.layout.filterModule.value && !this.ioc.routeData.filter) {
              this.ioc.filterChange$.next(module.layout.filterModule.value);
            }

            if (module.layout.overview) {
              if (module.layout.overview.defaultView) {
                overviewData.activeView = module.layout.overview.defaultView;
                overviewData.currentView = getCurrentView(module.layout.overview.defaultView);
              }

              if (module.layout.overview.toolbar) {
                overviewData.toolbar = module.layout.overview.toolbar.reduce((acc, cur: any) => {
                  if (typeof cur === 'string' || !cur.roles || cur.roles.includes(this.state.role)) {
                    acc.push((cur as any).item || cur);
                  }

                  return acc;
                }, []);
              }

              overviewData.showViewSelector = !!module.layout.overview.showViewSelector;

              if (overviewData.showViewSelector) {
                overviewData.views = module.layout.overview.views || [];
              }
            }

            switch (module?.layout?.table?.hideAdd?.constructor) {
              case Boolean: {
                overviewData.hideAdd = module.layout.table.hideAdd as boolean;
                break;
              }
              case Array: {
                overviewData.hideAdd = (module.layout.table.hideAdd as string[]).includes(
                  this.state.role
                );
                break;
              }
            }
          }

          this.ioc.items$ = combineLatest([
            this.ioc.pageSize.valueChanges
              .pipe(
                startWith(this.ioc.pageSize.value)
              ),
            this.ioc.filterChange$
              .pipe(
                tap(() =>
                  this.ioc.selection.clear()
                )
              ),
            this.ioc.searchControl
              .valueChanges
              .pipe(
                startWith(this.ioc.searchControl.value)
              ),
            this.ioc.sortChange$
          ])
            .pipe(
              switchMap(([pageSize, filter, search, sort]: any) => {
                const routeData = {...this.ioc.routeData};

                routeData.pageSize = pageSize as number;
                routeData.filter = filter;

                if (search) {
                  routeData.search = search;
                }

                if (sort) {
                  routeData.sort = Array.isArray(sort) ? sort.map(it => ({
                    ...it,
                    active: Parser.standardizeKey(
                      it.active
                    )
                  })) : {
                    active: Parser.standardizeKey(sort.active),
                    direction: sort.direction
                  };
                } else {
                  routeData.sort = null;
                }

                this.state.setRouteData(routeData, state.url);
                this.ioc.routeData = routeData;

                return overviewData.overviewService.get(
                  module,
                  pageSize,
                  filter,
                  search,
                  sort
                );
              }),
              shareReplay(1)
            );

          this.ioc.allChecked$ = combineLatest([
            this.ioc.items$,
            this.ioc.selection.changed.pipe(startWith({}))
          ])
            .pipe(
              map(([items]) => ({
                checked: this.ioc.selection.selected.length === items.length
              }))
            );

          return overviewData;
        })
      )
  }
}
