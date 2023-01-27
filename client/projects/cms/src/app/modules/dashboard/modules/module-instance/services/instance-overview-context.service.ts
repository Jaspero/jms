import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectorRef, Inject, Injectable, Optional, TemplateRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DomSanitizer} from '@angular/platform-browser';
import {parseTemplate, safeEval} from '@jaspero/utils';
import {MaybeArray, TranslocoScope, TranslocoService, TRANSLOCO_LANG, TRANSLOCO_SCOPE} from '@ngneat/transloco';
import {notify} from '@shared/utils/notify.operator';
import {InstanceSort, Module, ModuleLayoutTableColumn} from '@definitions';
import {BehaviorSubject, combineLatest, forkJoin, Observable, Subject} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {ExportComponent} from '../../../../../elements/export/export.component';
import {PAGE_SIZES} from '../../../../../shared/consts/page-sizes.const';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../../shared/services/db/db.service';
import {confirmation} from '../../../../../shared/utils/confirmation';
import {ColumnPipe} from '../pipes/column/column.pipe';
import {loadingQueue$} from '../utils/loading-queue';

@Injectable()
export class InstanceOverviewContextService {
  constructor(
    private domSanitizer: DomSanitizer,
    private bottomSheet: MatBottomSheet,
    private dbService: DbService,
    private transloco: TranslocoService,
    @Optional()
    @Inject(TRANSLOCO_SCOPE)
    private providerScope: MaybeArray<TranslocoScope>,
    @Optional()
    @Inject(TRANSLOCO_LANG)
    private providerLang: string | null
  ) {
  }

  module$ = new BehaviorSubject<Module>(null);
  items$: Observable<any[]>;
  columnPipe: ColumnPipe;
  loading$ = loadingQueue$
    .pipe(
      map(items => !!items.length)
    );
  routeData: any;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$: BehaviorSubject<boolean>;
  filterChange$: BehaviorSubject<WhereFilter[]>;
  sortChange$: BehaviorSubject<InstanceSort | InstanceSort[]>;
  hasMore$: BehaviorSubject<boolean>;
  loadMore$: Subject<boolean>;
  searchControl: FormControl;
  selection: SelectionModel<string>;
  pageSizes = PAGE_SIZES;
  subHeaderTemplate$ = new Subject<TemplateRef<any>>();
  pageSize: FormControl;

  deleteSelection(moduleId: string, items: any[]) {
    const module = this.module$.getValue();
    confirmation(
      [
        switchMap(() =>
          forkJoin(
            this.selection.selected.map(id =>
              this.dbService.removeDocument(moduleId, id)
            )
          )
        ),
        tap(() => {
          this.selection.clear();
        }),
        notify()
      ],
      {
        description: this.selection.selected.reduce((acc, cur) => {
          const found = items.find(it => it.id === cur);
          return acc + `<li><b>${this.display(moduleId, found ? {id: cur, ...found.data} : cur, module)}</b></li>`;
        }, `<p class="m-b-s">${this.transloco.translate('REMOVE_ITEMS_WARNING')}</p><ul>`) + '</ul>'
      }
    );
  }

  deleteOne(moduleId: string, item: any) {
    confirmation(
      [
        switchMap(() => this.dbService.removeDocument(moduleId, item.id)),
        tap(() => {
          if (this.selection.selected.length && this.selection.selected.some(it => it === item.id)) {
            this.selection.deselect(item.id);
          }
        }),
        notify()
      ],
      {
        description: 'REMOVE_ONE',
        variables: {
          value: `<b>${this.display(moduleId, {id: item.id, ...item.data})}</b>`
        }
      }
    );
  }

  masterToggle() {
    combineLatest([this.allChecked$, this.items$])
      .pipe(take(1))
      .subscribe(([check, items]) => {
        if (check.checked) {
          this.selection.clear();
        } else {
          items.forEach(row => this.selection.select(row.id));
        }
      });
  }

  export(columns?: ModuleLayoutTableColumn[]) {

    combineLatest([
      this.module$,
      this.filterChange$,
      this.sortChange$
    ])
      .pipe(
        take(1)
      )
      .subscribe(([module, filterValue, sort]) => {
        this.bottomSheet.open(ExportComponent, {
          data: {
            ids: this.selection.selected,
            filterValue,
            columns,
            sort,
            collection: module.id,
            filterModule: module.layout?.filterModule,
            subCollection: module.subCollectionPath
          }
        });
      });
  }

  trackById(index, item) {
    return item.id;
  }

  setUp(
    cdr: ChangeDetectorRef
  ) {
    this.columnPipe = new ColumnPipe(
      this.domSanitizer,
      this.transloco,
      cdr,
      this.providerScope,
      this.providerLang,
      this.dbService
    );

    this.columnPipe.ioc = this;
  }

  private display(moduleId: string, item: any, module?: Module) {
    if (!module) {
      module = this.module$.getValue();
    }

    if (typeof item === 'string') {
      return item;
    }

    if (moduleId !== module.id || !module.layout?.editTitleKey) {
      return item.id;
    }

    const evaluated = safeEval(module.layout.editTitleKey);
    const proces = typeof evaluated === 'function'
      ? evaluated(item)
      : parseTemplate(`{{${module.layout.editTitleKey}}}`, item);

    return proces && proces !== 'undefined' ? proces : item.id;
  }
}
