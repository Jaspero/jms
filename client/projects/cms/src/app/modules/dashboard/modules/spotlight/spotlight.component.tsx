import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, signOut} from '@angular/fire/auth';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {safeEval} from '@jaspero/utils';
import {JSX, Module} from '@definitions';
import {BehaviorSubject, combineLatest, forkJoin, from, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../../../environments/static-config';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {relevantSearch} from '../../../../shared/utils/relevant-search';

@Component({
  selector: 'jms-spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotlightComponent implements OnInit {
  constructor(
    private state: StateService,
    private router: Router,
    private db: DbService,
    private auth: Auth,
    private dialogRef: MatDialogRef<SpotlightComponent>
  ) {
  }

  searchControl: FormControl;
  results$: Observable<any>;
  modules$ = new BehaviorSubject<Module[]>([]);

  ngOnInit() {
    this.state.modules$.pipe(
      take(1),
      tap((modules) => {
        this.modules$.next(modules);
      })
    ).subscribe();

    this.searchControl = new FormControl('');

    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search) => {

        search = (search || '').trim().toLowerCase().replace(/[.@#$/,-]/g, ' ').trim();


        if (!search) {
          return of([]);
        }

        return this.state.modules$.pipe(
          filter(item => !!item),
          switchMap(MODULES => {
            const result = [];

            result.push(
              of({
                title: 'MODULES',
                items: MODULES.filter(module => {
                  return !module.id.includes('{docId}')
                    && !module?.spotlight?.hide
                    && (
                      module?.id?.toLowerCase().includes(search.toLowerCase())
                      || module?.name?.toLowerCase().includes(search.toLowerCase())
                    );
                }).map(module => {
                  return {
                    type: 'link',
                    href: `/m/${module.id}`,
                    label: module.name,
                    description: module.id
                  };
                })
              })
            );

            const searchModules = MODULES.filter(item => item?.spotlight?.queryFields?.length);
            result.push(
              from(
                new Promise<{
                  id: string;
                  module: string;
                  moduleName: string;
                  template: string;
                }[]>(async (resolve) => {
                  const data = [];

                  for (const module of searchModules) {
                    if (data.length > 5) {
                      return resolve(data);
                    }

                    await relevantSearch({
                      query: search,
                      col: module.id,
                      limit: 5
                    }).then(async (searchResult) => {

                      for (const item of searchResult) {
                        const searchItem = {
                          ...item,
                          module: module.id,
                          moduleName: module.name,
                          template: module.spotlight?.template
                        };

                        let valid = true;

                        // await this.db.getDocument(searchItem.module, searchItem.id).pipe(
                        //   take(1),
                        //   catchError(() => {
                        //     valid = false;
                        //
                        //     return of(null);
                        //   })
                        // ).toPromise();

                        if (valid) {
                          data.push(searchItem);
                        }
                      }
                      //
                      // data.push(...searchResult.map(item => {
                      //   return {
                      //     ...item,
                      //     module: module.id,
                      //     moduleName: module.name,
                      //     template: module.spotlight?.template
                      //   };
                      // }));
                    });
                  }

                  return resolve(data);
                })
              ).pipe(
                switchMap((results) => {
                  if (!results.length) {
                    return of([]);
                  }

                  return forkJoin(results.map(item => this.db.getDocument(item.module, item.id).pipe(
                    catchError(() => of(null)),
                    map((data) => {
                      if (!data) {
                        return null;
                      }

                      const packet: any = {
                        data,
                        module: item.module,
                        moduleName: item.moduleName
                      };

                      const url = URL.createObjectURL(new Blob([JSON.stringify(packet)], {type: 'application/json'}));
                      packet.template = item.template ? safeEval(item.template)(packet) : JSX(<jms-spotlight-result
                        url={url} />);

                      return packet;
                    })
                  )));
                }),
                map((results) => {
                  return {
                    title: 'DOCUMENTS',
                    items: results.filter(item => !!item).map(item => {
                      return {
                        ...item,
                        type: 'link',
                        href: `/m/${item.module}/${item.data.id}`
                      };
                    })
                  };
                })
              )
            );

            result.push(of({
              title: 'ACTIONS',
              items: [
                {
                  label: 'Profile',
                  type: 'link',
                  description: 'Open profile settings',
                  href: '/profile/information',
                  search: 'profile account settings'
                },
                {
                  label: 'Log Out',
                  type: 'action',
                  description: 'Log Out current account',
                  call: () => signOut(this.auth).then(() => this.router.navigate(STATIC_CONFIG.loginRoute)),
                  search: 'logout log out signout sign out'
                },
                ...(this.state.role === 'admin' ? [{
                  label: 'File Manager',
                  type: 'link',
                  description: 'Manage project storage',
                  href: '/file-manager',
                  search: 'manager file filemanager file manager storage upload download'
                }] : [])
              ].filter(item => {
                return item.search.includes(search.toLowerCase());
              })
            }));

            return combineLatest(result);
          })
        );
      })
    );
  }

  selectItem(item) {
    switch (item.type) {
      case 'link': {
        this.router.navigate([item.href]);
        break;
      }
      case 'action': {
        item?.call?.();
        break;
      }
    }

    this.dialogRef.close();
  }

  trackByHref(index, item) {
    return item.href;
  }

  trackByTitle(index, item) {
    return item.title;
  }
}
