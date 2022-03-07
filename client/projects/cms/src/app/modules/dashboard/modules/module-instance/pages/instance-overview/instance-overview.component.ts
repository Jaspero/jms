import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FilterMethod, InstanceSort, Module, ModuleOverviewView} from 'definitions';
import {Parser} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject, combineLatest, merge, Subject} from 'rxjs';
import {map, shareReplay, skip, startWith, switchMap, tap} from 'rxjs/operators';
import {DEFAULT_PAGE_SIZE} from '../../../../../../shared/consts/page-sizes.const';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {queue} from '../../../../../../shared/utils/queue.operator';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {createSelector} from '../../../../../../elements/element.decorator';

@UntilDestroy()
@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent implements OnInit, AfterViewInit {
  currentView: string;
  activeView: string;
  showViewSelector: boolean;
  name: string;
  views: ModuleOverviewView[];
  toolbar: string[];
  hideAdd = false;

  constructor(
    public ioc: InstanceOverviewContextService,
    private dbService: DbService,
    private state: StateService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.ioc.module$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(module => {

        const defaultData = {
          pageSize: null,
          sort: null,
          filter: null,
          search: ''
        };

        this.ioc.setUp(this.cdr);
        this.state.restoreRouteData(defaultData);
        this.ioc.routeData = this.state.getRouterData(defaultData);

        this.ioc.pageSize = new FormControl(this.ioc.routeData.pageSize || DEFAULT_PAGE_SIZE);
        this.ioc.emptyState$ = new BehaviorSubject(false);
        this.ioc.filterChange$ = new BehaviorSubject(this.ioc.routeData.filter);
        this.ioc.sortChange$ = new BehaviorSubject(this.ioc.routeData.sort);
        this.ioc.searchControl = new FormControl(this.ioc.routeData.search);
        this.ioc.hasMore$ = new BehaviorSubject(false);
        this.ioc.loadMore$ = new Subject<boolean>();
        this.ioc.selection = new SelectionModel<string>(true, []);

        this.name = module.name;
        this.currentView = this.getCurrentView('table');
        this.showViewSelector = false;
        this.views = [];
        this.toolbar = ['add'];

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
              this.currentView = this.getCurrentView(module.layout.overview.defaultView);
            }

            if (module.layout.overview.toolbar) {
              this.toolbar = module.layout.overview.toolbar.reduce((acc, cur: any) => {
                if (typeof cur === 'string' || !cur.roles || cur.roles.includes(this.state.role)) {
                  acc.push((cur as any).item || cur);
                }

                return acc;
              }, []);
            }

            this.showViewSelector = !!module.layout.overview.showViewSelector;

            if (this.showViewSelector) {
              this.views = module.layout.overview.views || [];
            }
          }

          switch (module?.layout?.table?.hideAdd?.constructor) {
            case Boolean: {
              this.hideAdd = module.layout.table.hideAdd as boolean;
              break;
            }
            case Array: {
              this.hideAdd = (module.layout.table.hideAdd as string[]).includes(
                this.state.role
              );
              break;
            }
            default: {
              this.hideAdd = false;
              break;
            }
          }
        }

        this.ioc.items$ = combineLatest([
          this.ioc.pageSize.valueChanges
            .pipe(
              startWith(this.ioc.pageSize.value)
            ),
          this.ioc.filterChange$,
          this.ioc.searchControl
            .valueChanges
            .pipe(
              startWith(this.ioc.searchControl.value)
            ),
          this.ioc.sortChange$
        ]).pipe(
          switchMap(([pageSize, filter, search, sort]: any) => {
            const routeData = {...this.ioc.routeData};

            routeData.pageSize = pageSize as number;
            routeData.filter = filter;

            if (search) {
              routeData.search = search;
            }

            if (sort) {
              routeData.sort = sort as InstanceSort;
              routeData.sort.active = Parser.standardizeKey(
                routeData.sort.active
              );
            } else {
              routeData.sort = null;
            }

            this.state.setRouteData(routeData);
            this.ioc.routeData = routeData;

            return this.dbService.getDocuments(
              module.id,
              pageSize,
              sort,
              null,
              this.generateFilters(
                module,
                search,
                filter
              ),
              null,
              module.collectionGroup
            )
              .pipe(
                queue()
              );
          }),
          switchMap(snapshots => {
            let cursor;

            this.ioc.hasMore$.next(snapshots.length === this.ioc.routeData.pageSize);

            if (snapshots.length) {
              cursor = snapshots[snapshots.length - 1];
              this.ioc.emptyState$.next(false);
            } else {
              this.ioc.emptyState$.next(true);
            }

            const changeListener = (cu = null) => {
              return this.dbService.getStateChanges(
                module.id,
                this.ioc.routeData.pageSize,
                this.ioc.routeData.sort,
                cu,
                this.generateFilters(module),
                module.collectionGroup
              ).pipe(
                skip(1),
                tap(snaps => {
                  snaps.forEach(snap => {
                    const index = snapshots.findIndex(
                      sp => sp.id === snap.doc.id
                    );

                    switch (snap.type) {
                      case 'added':
                        if (index === -1) {
                          snapshots.push(snap.doc);
                        }
                        break;
                      case 'modified':
                        if (index !== -1) {
                          snapshots[index] = snap.doc;
                        }
                        break;
                      case 'removed':
                        if (index !== -1) {
                          snapshots.splice(index, 1);
                        }
                        break;
                    }
                  });
                })
              );
            };

            return merge(
              this.ioc.loadMore$
                .pipe(
                  switchMap(() =>
                    merge(
                      this.dbService
                        .getDocuments(
                          module.id,
                          this.ioc.routeData.pageSize,
                          this.ioc.routeData.sort,
                          cursor,
                          this.generateFilters(module),
                          null,
                          module.collectionGroup
                        )
                        .pipe(
                          queue(),
                          tap(snaps => {
                            if (snaps.length < this.ioc.routeData.pageSize) {
                              this.ioc.hasMore$.next(false);
                            }

                            if (snaps.length) {
                              cursor = snaps[snaps.length - 1];

                              snapshots.push(
                                ...snaps
                              );
                            }
                          })
                        ),
                      changeListener(cursor)
                    )
                  )
                ),
              changeListener(null)
            )
              .pipe(
                startWith({}),
                map(() =>
                  snapshots.map(it => ({
                    data: it.data(),
                    ref: it.ref,
                    id: it.id
                  }))
                )
              );
          }),
          shareReplay(1)
        );

        this.ioc.allChecked$ = combineLatest([
          this.ioc.items$,
          this.ioc.selection.changed.pipe(startWith({}))
        ]).pipe(
          map(([items]) => ({
            checked: this.ioc.selection.selected.length === items.length
          }))
        );

        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.ioc.allChecked$ = combineLatest([
      this.ioc.items$,
      this.ioc.selection.changed.pipe(startWith({}))
    ]).pipe(
      map(([items]) => ({
        checked: this.ioc.selection.selected.length === items.length
      }))
    );
  }

  getCurrentView(selector: string) {
    this.activeView = selector;

    const toUse = createSelector(selector);

    return `<${toUse}></${toUse}>`;
  }

  changeCurrentView(view: string) {
    this.currentView = this.getCurrentView(view);
    this.cdr.markForCheck();
  }

  generateFilters(
    module: Module,
    search = this.ioc.searchControl.value,
    filter = this.ioc.routeData.filter
  ) {
    return search && search.trim() ?
      [{
        key: module.layout.searchModule.key,
        operator: module.layout.searchModule.simple ? FilterMethod.Equal : FilterMethod.ArrayContains,
        value: search.trim().toLowerCase()
      }] :
      filter;
  }
}
