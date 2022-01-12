import {SelectionModel} from '@angular/cdk/collections';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {Parser, State} from '@jaspero/form-builder';
import {parseTemplate, safeEval} from '@jaspero/utils';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
import {AsyncSubject, BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {ColumnOrganizationComponent} from '../../modules/dashboard/modules/module-instance/components/column-organization/column-organization.component';
import {InstanceOverviewContextService} from '../../modules/dashboard/modules/module-instance/services/instance-overview-context.service';
import {PipeType} from '../../shared/enums/pipe-type.enum';
import {Action} from '../../shared/interfaces/action.interface';
import {FilterModule} from '../../shared/interfaces/filter-module.interface';
import {ImportModule} from '../../shared/interfaces/import-module.interface';
import {InstanceSort} from '../../shared/interfaces/instance-sort.interface';
import {ModuleAuthorization} from '../../shared/interfaces/module-authorization.interface';
import {ModuleLayoutTableColumn} from '../../shared/interfaces/module-layout-table.interface';
import {ModuleDefinitions} from '../../shared/interfaces/module.interface';
import {SearchModule} from '../../shared/interfaces/search-module.interface';
import {SortModule} from '../../shared/interfaces/sort-module.interface';
import {DbService} from '../../shared/services/db/db.service';
import {StateService} from '../../shared/services/state/state.service';
import {notify} from '../../shared/utils/notify.operator';
import {processActions} from '../../shared/utils/process-actions';

interface TableData {
  moduleId: string;
  authorization?: ModuleAuthorization;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: ModuleLayoutTableColumn[];
  originalColumns: ModuleLayoutTableColumn[];
  schema: JSONSchema7;
  stickyHeader: boolean;
  sort?: InstanceSort;
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
  collectionGroup?: boolean;
  actions?: Action[];
  selectionActions?: Action<SelectionModel<string>>[];
}

@UntilDestroy()
@Component({
  selector: 'jms-e-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public ioc: InstanceOverviewContextService,
    private state: StateService,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private dbService: DbService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
  populateCache: {[key: string]: Observable<any>} = {};

  permission = {
    write: false,
    read: false
  };

  maxHeight$ = new Subject<string>();

  ngOnInit() {
    /**
     * Component isn't necessarily destroyed
     * before it's instantiated again
     */
    setTimeout(() => {
      this.ioc.subHeaderTemplate$.next(this.subHeaderTemplate);
    }, 100);

    this.ioc.module$.pipe(untilDestroyed(this)).subscribe(data => {
      let displayColumns: string[];
      let tableColumns: ModuleLayoutTableColumn[];
      let pColumns: ModuleLayoutTableColumn[];
      let sort: InstanceSort;
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
          acc.push(key || this.dbService.createId());
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

        if (data.layout.table) {
          addedData = [
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
          }, {});

          if (data.layout.table.actions) {
            addedData.actions = processActions(this.state.role, data.layout.table.actions);
          }

          if (data.layout.table.selectionActions) {
            addedData.selectionActions = processActions(this.state.role, data.layout.table.selectionActions);
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

      if (!addedData.hideDelete || !addedData.hideEdit) {
        displayColumns.push('actions');
      }

      this.permission.write = !data.authorization?.write || data.authorization.write.includes(this.state.role);
      this.permission.read = !data.authorization?.read || data.authorization.read.includes(this.state.role);

      this.data = {
        moduleId: data.id,
        collectionGroup: data.collectionGroup,
        moduleAuthorization: data.authorization,
        name: data.name,
        schema: data.schema,
        displayColumns,
        tableColumns,
        sort,
        originalColumns: pColumns,
        definitions: data.definitions,
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
        map(([items]: any) => items.map(item => this.mapRow(this.data, item)))
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

    setTimeout(() => {

      /**
       * Height of table header and footer
       * plus padding
       */
      let maxHeight = 148;

      document.querySelectorAll('[data-include-max-height]').forEach((el: HTMLDivElement) => {
        maxHeight += el.offsetHeight;
      });

      this.maxHeight$.next(`calc(100vh - ${maxHeight}px)`);
    }, 100)
  }

  ngOnDestroy() {
    this.ioc.subHeaderTemplate$.next(null);
  }

  openColumnOrganization() {
    this.dialog.open(this.columnOrganizationTemplate, {
      width: '400px'
    });
  }

  updateColumns(columnOrganization: ColumnOrganizationComponent) {
    this.data.originalColumns = columnOrganization.save();
    const columns = this.constructColumns(this.data.originalColumns);

    if (!this.data.hideCheckbox) {
      columns.displayColumns.unshift('check');
    }

    if (!this.data.hideDelete || !this.data.hideEdit) {
      columns.displayColumns.push('actions');
    }

    this.data.displayColumns = columns.displayColumns;
    this.data.tableColumns = columns.tableColumns;

    this.dialog.closeAll();
    this.columnsSorted$.next(true);
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

      displayColumns.push(this.dbService.createId());
      tableColumns.push({
        ...column,
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

      const field = this.parserCache[rowData.id].field(
        key,
        this.parserCache[rowData.id].pointers[key],
        overview.definitions,
        false
      );

      field.control.valueChanges
        .pipe(
          switchMap(value =>
            this.dbService.setDocument(
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
        }
      }

      if (nested) {
        return value;
      } else if (column.populate) {
        let id = column.populate.id;

        if (!id) {
          try {
            id = get(rowData, column.key as string);
          } catch (e) {}
        }

        if (!id) {
          return new TemplatePortal(
            this.simpleColumnTemplate,
            this.viewContainerRef,
            {value: column.populate.fallback || '-'}
          );
        }

        const parsedCollection = parseTemplate(
          column.populate.collection,
          rowData,
          (key, entry) => get(entry, key),
          true
        );
        const popKey = `${parsedCollection}-${
          column.populate.lookUp
            ? [
                column.populate.lookUp.key,
                column.populate.lookUp.operator,
                id
              ].join('-')
            : id
        }`;

        if (!this.populateCache[popKey]) {
          if (column.populate.lookUp) {
            this.populateCache[popKey] = this.dbService
              .getDocuments(parsedCollection, 1, undefined, undefined, [
                {
                  ...column.populate.lookUp,
                  value: id
                }
              ])
              .pipe(
                map(docs => {
                  if (docs[0]) {
                    const populated: any = docs[0].data();

                    if (
                      populated &&
                      populated.hasOwnProperty(
                        column.populate.displayKey || 'name'
                      )
                    ) {
                      return this.ioc.columnPipe.transform(
                        populated[column.populate.displayKey || 'name'],
                        column.pipe,
                        column.pipeArguments,
                        {rowData, populated}
                      );
                    } else {
                      return column.populate.fallback || '-';
                    }
                  } else {
                    return column.populate.fallback || '-';
                  }
                }),
                shareReplay(1)
              );
          } else {
            this.populateCache[popKey] = this.dbService
              .getDocument(parsedCollection, id)
              .pipe(
                map(populated => {
                  if (
                    populated.hasOwnProperty(
                      column.populate.displayKey || 'name'
                    )
                  ) {
                    return this.ioc.columnPipe.transform(
                      populated[column.populate.displayKey || 'name'],
                      column.pipe,
                      column.pipeArguments,
                      {rowData, populated}
                    );
                  } else {
                    return column.populate.fallback || '-';
                  }
                }),
                shareReplay(1)
              );
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

  navigateToSingleView(element, e: MouseEvent) {
    const link = `/m/${this.data.collectionGroup ? element.ref.parent.path : this.data.moduleId}/single/${element.id}`;
    if (e.ctrlKey || e.metaKey) {
      window.open(link, '_blank');
    } else {
      this.router.navigate([link]);
    }
  }
}
