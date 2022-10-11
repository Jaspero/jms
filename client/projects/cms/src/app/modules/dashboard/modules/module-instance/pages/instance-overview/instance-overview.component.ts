import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Parser} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ModuleOverviewView} from '@definitions';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {createSelector} from '../../../../../../elements/element.decorator';
import {DEFAULT_PAGE_SIZE} from '../../../../../../shared/consts/page-sizes.const';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {OverviewService} from '../../interfaces/overview-service.interface';
import {DefaultOverviewService} from '../../services/default-overview.service';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';

@UntilDestroy()
@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent implements OnInit, AfterViewInit {
  constructor(
    public ioc: InstanceOverviewContextService,
    private state: StateService,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {
  }

  currentView: string;
  activeView: string;
  showViewSelector: boolean;
  name: string;
  views: ModuleOverviewView[];
  toolbar: string[];
  hideAdd = false;
  overviewService: OverviewService;

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

        this.overviewService = this.injector.get(module.layout?.overview?.service || DefaultOverviewService);
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

            this.state.setRouteData(routeData);
            this.ioc.routeData = routeData;

            return this.overviewService.get(
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
    this.ioc.subHeaderTemplate$.next(null);
    this.currentView = this.getCurrentView(view);
    this.cdr.markForCheck();
  }
}
