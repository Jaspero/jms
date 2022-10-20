import {Injectable} from '@angular/core';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {Module, MODULES, User} from '@definitions';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transloco: TranslocoService
  ) {
    const language = localStorage.getItem('language');

    if (language) {
      this.transloco.setActiveLang(language);
    }

    this.transloco.langChanges$.subscribe(lang => {
      localStorage.setItem('language', lang);
    });

    // @ts-ignore
    this.translationsReady$ = this.transloco.events$
      .pipe(
        // @ts-ignore
        filter(e => e.type === 'translationLoadSuccess'),
        map(() => true),
        distinctUntilChanged(),
        shareReplay()
      );

    this.translationsReady$.subscribe();

    // @ts-ignore
    this.modules$ = of(MODULES)
      .pipe(
        shareReplay(1)
      );
  }

  role: string;
  permissions: {
    [key: string]: {
      get: boolean;
      list: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
    }
  };
  user: User;
  loadingQue$ = new Subject<Array<string | boolean>>();
  modules$: Observable<Module[]>;
  entryPath: string;

  page$ = new BehaviorSubject<{module?: {id: string, name: string}}>({});
  lastPublished$ = new BehaviorSubject<number>(null);
  translationsReady$: Observable<boolean>;

  /**
   * Holds state information for all
   * previously loaded routes
   */
  routerData: {[url: string]: any} = {};

  elementsRegistered = false;

  setRouteData(
    data: any,
    url = this.router.routerState.snapshot.url
  ) {
    this.routerData[url] = data;

    const persisted = data.filter ? data.filter.filter(it => it.persist) : null;

    this.router.navigate([], {
      queryParams: persisted && persisted.length ? {
        filter: JSON.stringify(persisted)
      } : {}
    });
  }

  getRouterData<T = any>(
    defaultData: any = {
      sort: {
        direction: 'desc',
        active: 'name'
      },
      pageSize: 10,
      filters: {
        search: ''
      }
    },
    url = this.router.routerState.snapshot.url
  ): T {

    if (this.routerData[url]) {
      return this.routerData[url];
    }

    return defaultData;
  }

  restoreRouteData(
    defaultData = {},
    url = this.router.routerState.snapshot.url,
    queryParams = this.activatedRoute.snapshot.queryParams
  ) {
    if (queryParams.filter) {

      // tslint:disable-next-line:no-shadowed-variable
      let filter;

      try {
        filter = JSON.parse(queryParams.filter);
      } catch (e) {}

      if (filter) {
        this.routerData[url] = {
          ...defaultData,
          filter
        };
      }
    }
  }
}
