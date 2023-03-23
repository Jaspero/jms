import {SelectionModel} from '@angular/cdk/collections';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {Definitions, Parser, State} from '@jaspero/form-builder';
import {parseTemplate, random, safeEval, toLabel} from '@jaspero/utils';
import {TranslocoService} from '@ngneat/transloco';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {
  FilterModule,
  ImportModule,
  InstanceSort,
  ModuleDefinitions,
  ModuleLayoutTableColumn,
  PipeType,
  SearchModule,
  SortModule
} from '@definitions';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
import {AsyncSubject, BehaviorSubject, combineLatest, forkJoin, Observable, of, ReplaySubject, Subject, Subscription} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap, take, tap} from 'rxjs/operators';
import {OverviewService} from '../../modules/dashboard/modules/module-instance/interfaces/overview-service.interface';
import {SingleService} from '../../modules/dashboard/modules/module-instance/interfaces/single-service.interface';
import {DefaultOverviewService} from '../../modules/dashboard/modules/module-instance/services/default-overview.service';
import {DefaultSingleService} from '../../modules/dashboard/modules/module-instance/services/default-single.service';
import {InstanceOverviewContextService} from '../../modules/dashboard/modules/module-instance/services/instance-overview-context.service';
import {Action} from '../../shared/interfaces/action.interface';
import {StateService} from '../../shared/services/state/state.service';
import {processActions} from '../../shared/utils/process-actions';
import {toObservable} from '../../shared/utils/to-observable';
import {ColumnOrganizationComponent} from '../column-organization/column-organization.component';
import {Element} from '../element.decorator';
import {FilterDialogComponent} from '../filter-dialog/filter-dialog.component';
import {SortDialogComponent} from '../sort-dialog/sort-dialog.component';

interface TableData {
  moduleId: string;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: ModuleLayoutTableColumn[];
  originalColumns: ModuleLayoutTableColumn[];
  schema: JSONSchema7;
  stickyHeader: boolean;
  sort?: InstanceSort | InstanceSort[];
  sortModule?: SortModule;
  filterModule?: FilterModule;
  searchModule?: SearchModule;
  importModule?: ImportModule;
  hideCheckbox?: boolean;
  hideEdit?: boolean;
  hideAdd?: boolean;
  hideDelete?: boolean;
  hideExport?: boolean;
  hideImport?: boolean;
  hasActions: boolean;
  actions?: Action[];
  selectionActions?: Action<SelectionModel<string>>[];
}

@Element()
@UntilDestroy()
@Component({
  selector: 'jms-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, AfterViewInit {
  constructor(
    public ioc: InstanceOverviewContextService,
    private state: StateService,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService
  ) {
  }

  /**
   * Using view children so we can listen for changes
   */
  @ViewChildren(MatSort)
  sort: QueryList<MatSort>;
  @ViewChild('subHeaderTemplate', {static: true})
  subHeaderTemplate: TemplateRef<any>;
  @ViewChild('simpleColumn', {static: true})
  simpleColumnTemplate: TemplateRef<any>;
  @ViewChild('populateColumn', {static: true})
  populateColumnTemplate: TemplateRef<any>;
  @ViewChild('observableColumn', {static: true})
  observableColumnTemplate: TemplateRef<any>;
  @ViewChild('columnOrganization', {static: true})
  columnOrganizationTemplate: TemplateRef<any>;
  items$: Observable<any>;
  columnsSorted$ = new BehaviorSubject(false);
  data: TableData;
  parserCache: {[key: string]: Parser} = {};
  controlCache: {[key: string]: any} = {};
  populateCache: {[key: string]: Observable<any>} = {};
  permission = {
    get: false,
    list: false,
    create: false,
    update: false,
    delete: false
  };
  maxHeight$ = new BehaviorSubject<string>('auto');

  singleService: SingleService;
  overviewService: OverviewService;

  get showDelete() {
    return !this.data.hideDelete && this.permission.delete;
  }

  get showActionsColumn() {
    return !this.data.hideEdit || this.showDelete || this.data.hasActions;
  }

  ngOnInit() {
    this.ioc.subHeaderTemplate$.next(this.subHeaderTemplate);
    this.ioc.module$.pipe(untilDestroyed(this)).subscribe(data => {
      let displayColumns: string[];
      let tableColumns: ModuleLayoutTableColumn[];
      let pColumns: ModuleLayoutTableColumn[];
      let sort: InstanceSort | InstanceSort[];
      let addedData: any = {
        hideCheckbox: false,
        hideAdd: false,
        hideEdit: false,
        hideDelete: false,
        hideExport: false,
        hideImport: false
      };

      if (data.layout && data.layout.table && data.layout.table.tableColumns) {
        /**
         * Filter authorized columns
         */
        pColumns = data.layout.table.tableColumns.filter(column =>
          column.authorization
            ? column.authorization.includes(this.state.role)
            : true
        );

        const columns = this.constructColumns(pColumns);
        displayColumns = columns.displayColumns;
        tableColumns = columns.tableColumns;
      } else {
        const topLevelProperties = Object.keys(data.schema.properties || {});

        displayColumns = topLevelProperties.reduce((acc, key) => {
          acc.push(key || random.string(12));
          return acc;
        }, []);
        tableColumns = topLevelProperties.map(key => ({
          // Make the key a valid json pointer
          key: '/' + key,
          label: key
        }));
      }

      if (data.layout) {
        sort = data.layout.sort;

        const actions = data.layout.instance?.actions || data.layout.table?.actions;

        if (actions) {
          addedData.actions = processActions(this.state.role, actions, this.ioc);
        }

        if (data.layout.table) {
          addedData = {
            ...addedData,
            ...[
              'hideCheckbox',
              'hideEdit',
              'hideDelete',
              'hideExport',
              'hideImport'
            ].reduce((acc, key) => {
              acc[key] = data.layout.table[key]
                ? typeof data.layout.table[key] === 'boolean'
                  ? true
                  : data.layout.table[key].includes(this.state.role)
                : false;
              return acc;
            }, {})
          };

          if (data.layout.table.selectionActions) {
            addedData.selectionActions = processActions(this.state.role, data.layout.table.selectionActions, this.ioc);
          }

          if (data.layout.table.hideAdd) {
            addedData.hideAdd =
              data?.layout?.table?.hideAdd?.constructor === Boolean
                ? data.layout.table.hideAdd
                : (data.layout.table.hideAdd as string[]).includes(
                  this.state.role
                );
          }
        }
      }

      if (!addedData.hideCheckbox) {
        displayColumns.unshift('check');
      }

      if (!addedData.hideDelete || !addedData.hideEdit || addedData.actions?.length) {
        displayColumns.push('actions');
      }

      /**
       * Permissions are based on the
       * root collection
       */
      const collection = data.id.split('/')[0];

      this.permission = this.state.permissions[collection];

      this.singleService = this.injector.get(data.layout?.instance?.service || DefaultSingleService);
      this.overviewService = this.injector.get(data.layout?.overview?.service || DefaultOverviewService);

      this.data = {
        moduleId: data.id,
        name: data.name,
        schema: data.schema,
        displayColumns,
        tableColumns,
        sort,
        originalColumns: pColumns,
        definitions: data.definitions,
        hasActions: !!addedData.actions?.length,
        ...(data.layout
          ? {
            stickyHeader:
              data.layout.table &&
                data.layout.table.hasOwnProperty('stickyHeader')
                ? data.layout.table.stickyHeader
                : true,
            sortModule: data.layout.sortModule,
            filterModule: data.layout.filterModule,
            searchModule: data.layout.searchModule,
            importModule: data.layout.importModule,
            ...addedData
          }
          : {
            stickyHeader: true
          })
      };

      this.items$ = combineLatest([this.ioc.items$, this.columnsSorted$]).pipe(
        map(([items]: any) => items.map(item => this.mapRow(this.data, item))),
        tap(() => this.adjustHeight())
      );

      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.sort.changes
      .pipe(
        startWith(this.sort),
        filter(change => change.last),
        switchMap(change => change.last.sortChange),
        untilDestroyed(this)
      )
      .subscribe((value: any) => {
        this.ioc.sortChange$.next(value);
      });

    setTimeout(() => this.adjustHeight(), 100);
  }

  adjustHeight() {
    /**
      * Height of table header and footer
      * plus padding
      */
    let maxHeight = 169;

    document.querySelectorAll('[data-include-max-height]').forEach((el: HTMLDivElement) => {
      maxHeight += el.offsetHeight;
    });

    const final = `calc(100vh - ${maxHeight}px)`;

    if (final !== this.maxHeight$.value) {
      this.maxHeight$.next(final);
    }
  }

  openFilterDialog(
    data: FilterModule
  ) {
    this.ioc.filterChange$
      .pipe(
        take(1),
        switchMap(filterValue =>
          this.dialog.open(FilterDialogComponent, {
            ...data.dialogOptions || {},
            width: '800px',
            data: {
              module: {
                ...data,
                value: filterValue ?
                  filterValue.reduce((acc, cur) => {
                    acc[cur.key] = cur.value;
                    return acc;
                  }, {}) :
                  data.value
              },
              ioc: this.ioc
            }
          })
            .afterClosed()
        ),
        filter(value => !!value)
      )
      .subscribe(value =>
        this.ioc.filterChange$.next(value)
      );
  }

  openSortDialog(
    collection: string,
    collectionName: string,
    options: SortModule
  ) {
    this.dialog.open(SortDialogComponent, {
      width: '800px',
      data: {
        options,
        collection,
        collectionName
      }
    });
  }

  openColumnOrganization() {
    this.dialog.open(this.columnOrganizationTemplate, {
      width: '400px'
    });
  }

  updateColumns(event, columnOrganization: ColumnOrganizationComponent) {

    event.preventDefault();

    this.data.originalColumns = columnOrganization.save();
    const columns = this.constructColumns(this.data.originalColumns);

    if (!this.data.hideCheckbox) {
      columns.displayColumns.unshift('check');
    }

    if (this.showActionsColumn) {
      columns.displayColumns.push('actions');
    }

    this.data.displayColumns = columns.displayColumns;
    this.data.tableColumns = columns.tableColumns;

    this.dialog.closeAll();
    this.columnsSorted$.next(true);
  }

  toActionObservable(value, element) {
    return toObservable(value(element)).pipe(shareReplay(1)) as Observable<string>;
  }

  editPath(element: any) {
    return ['/m', ...element.ref.parent.path.split('/'), element.id];
  }

  private mapRow(overview: TableData, rowData: any) {
    const {id, ref, data} = rowData;

    return {
      data,
      id,
      ref,
      parsed: this.parseColumns(overview, {...data, id, ref})
    };
  }

  private constructColumns(columns: ModuleLayoutTableColumn[]) {
    const displayColumns = [];
    const tableColumns = [];

    for (const column of columns) {
      if (column.disabled) {
        continue;
      }

      const tooltip = column.tooltip
        ? safeEval(column.tooltip as string)
        : column.tooltip;

      displayColumns.push(random.string(12));
      tableColumns.push({
        ...column,
        label: column.label || toLabel(Array.isArray(column.key) ? column.key[0] : column.key),
        ...(tooltip && {
          tooltip,
          tooltipFunction: typeof tooltip === 'function'
        })
      });
    }

    return {
      displayColumns,
      tableColumns
    };
  }

  private parseColumns(overview: TableData, rowData: any, nested = false) {
    return overview.tableColumns.reduce((acc, column, index) => {

      const value = this.getColumnValue(
        column,
        overview,
        rowData,
        false,
        // @ts-ignore
        nested && column.showLabel
      );

      acc[index] = {
        value,
        ...(column.nestedColumns
          ? {
            nested: this.parseColumns(
              {...overview, tableColumns: column.nestedColumns},
              rowData,
              true
            )
          }
          : {})
      };
      return acc;
    }, {});
  }

  private getColumnValue(
    column: ModuleLayoutTableColumn,
    overview: TableData,
    rowData: any,
    nested = false,
    showLabel = false
  ) {
    if (column.control) {
      const key = column.key as string;

      if (!this.parserCache[rowData.id]) {
        this.parserCache[rowData.id] = new Parser(
          overview.schema,
          this.injector,
          State.Edit,
          this.state.role
        );
        this.parserCache[rowData.id].buildForm(rowData);
      }

      const field = this.parserCache[rowData.id].field({
        pointerKey: key,
        pointer: this.parserCache[rowData.id].pointers[key],
        definitions: overview.definitions as Definitions,
        single: true
      });

      try {
        const update = get(rowData, key);
        field.control.setValue(update, {emitEvent: false});
      } catch (e) { }

      const ccKey = `${rowData.id}/${key}`;

      if (this.controlCache[ccKey]) {
        this.controlCache[ccKey].unsubscribe();
      }

      this.controlCache[ccKey] = field.control.valueChanges
        .pipe(
          // @ts-ignore
          switchMap(value =>
            this.singleService.save(
              overview.moduleId,
              rowData.id,
              {
                [Parser.standardizeKey(key)]: value
              },
              {merge: true}
            )
          ),
          notify({
            success: null
          }),
          untilDestroyed(this)
        )
        .subscribe();

      return field.portal;
    } else {
      let value;

      if (column.resolveObservables && column.pipe) {
        if (!column.pipe.length) {
          column.pipe = [column.pipe as PipeType];
        }

        const pipes: any[] = [];

        pipes.push(map(() => {
          const key = column.key as string;

          if (has(rowData, key)) {
            return get(rowData, key);
          }

          return [];
        }));

        for (const [i, item] of (column.pipe as Array<PipeType>).entries()) {
          pipes.push(
            switchMap(data => {
              const result = this.ioc.columnPipe.transform(
                data,
                item,
                column.pipeArguments[i],
                rowData
              );

              const constructor = result?.constructor;
              if ([
                Observable,
                Subject,
                BehaviorSubject,
                ReplaySubject,
                AsyncSubject
              ].includes(constructor)
              ) {
                return result;
              } else {
                return of(result);
              }
            })
          );
        }

        return new TemplatePortal(
          this.observableColumnTemplate,
          this.viewContainerRef,
          // @ts-ignore
          {value: of(true).pipe(...pipes)}
        );
      }

      if (typeof column.key !== 'string') {
        value = column.key
          .map(key => this.getColumnValue({key}, overview, rowData, true))
          .join(column.hasOwnProperty('join') ? column.join : ', ');
      } else {
        if (has(rowData, column.key)) {
          value = this.ioc.columnPipe.transform(
            get(rowData, column.key),
            column.pipe,
            column.pipeArguments,
            rowData
          );
        } else {
          value = column.fallback || '';

          if (!nested) {
            value = this.transloco.translate(value);
          }
        }
      }

      if (nested) {
        return value;
      } else if (column.populate) {
        let id = column.populate.id;

        if (!id) {
          try {
            id = get(rowData, column.key as string);
          } catch (e) {
          }
        }

        if (!id) {
          return new TemplatePortal(
            this.simpleColumnTemplate,
            this.viewContainerRef,
            {value: this.transloco.translate(column.populate.fallback || '-')}
          );
        }

        const parsedCollection = parseTemplate(
          column.populate.collection,
          rowData,
          (key, entry) => get(entry, key),
          true
        );
        const displayKey = column.populate.displayKey || 'name';
        const popKey = `${parsedCollection}-${[
            column.populate.lookUp?.key || '',
            column.populate.lookUp?.operator || '',
            id,
            displayKey
          ].join('-')
          }`;

        const populateMethod = itId => this.singleService
          .get(parsedCollection, itId)
          .pipe(
            map(populated => {
              if (
                populated.hasOwnProperty(
                  displayKey
                )
              ) {
                return this.ioc.columnPipe.transform(
                  populated[displayKey],
                  column.pipe,
                  column.pipeArguments,
                  {rowData, populated}
                );
              } else {
                return this.transloco.translate(column.populate.fallback || '-');
              }
            }),
            shareReplay(1)
          );
        const populateLookupMethod = itId => this.overviewService
          .getDocuments(parsedCollection, 1, [
            {
              ...column.populate.lookUp,
              value: itId
            }
          ])
          .pipe(
            map(docs => {
              if (docs[0]) {
                const populated: any = docs[0].data();

                if (
                  populated &&
                  populated.hasOwnProperty(
                    displayKey
                  )
                ) {
                  return this.ioc.columnPipe.transform(
                    populated[displayKey],
                    column.pipe,
                    column.pipeArguments,
                    {rowData, populated}
                  );
                } else {
                  return this.transloco.translate(column.populate.fallback || '-');
                }
              } else {
                return this.transloco.translate(column.populate.fallback || '-');
              }
            }),
            shareReplay(1)
          );

        if (!this.populateCache[popKey]) {

          if (Array.isArray(id)) {
            if (column.populate.lookUp) {
              this.populateCache[popKey] = forkJoin(
                id.map(itId => populateLookupMethod(itId))
              )
                .pipe(
                  map(data => data.join(','))
                );
            } else {
              this.populateCache[popKey] = forkJoin(
                id.map(itId => populateMethod(itId))
              )
                .pipe(
                  map(data => data.join(','))
                );
            }
          } else {
            if (column.populate.lookUp) {
              this.populateCache[popKey] = populateLookupMethod(id);
            } else {
              this.populateCache[popKey] = populateMethod(id);
            }
          }
        }

        value = this.populateCache[popKey];

        if (showLabel) {
          value = this.ioc.columnPipe.transform(column.label, PipeType.Transloco) + ': ' + value;
        }

        return new TemplatePortal(
          this.populateColumnTemplate,
          this.viewContainerRef,
          {value}
        );
      } else {

        if (showLabel) {
          value = this.ioc.columnPipe.transform(column.label, PipeType.Transloco) + ': ' + value;
        }

        return new TemplatePortal(
          this.simpleColumnTemplate,
          this.viewContainerRef,
          {value}
        );
      }
    }
  }
}
