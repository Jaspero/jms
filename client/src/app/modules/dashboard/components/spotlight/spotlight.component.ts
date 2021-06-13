import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {BehaviorSubject, combineLatest, forkJoin, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, take, tap} from 'rxjs/operators';
import {Module} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';

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
    private dialog: MatDialog,
    private db: DbService
  ) {
  }

  searchControl: FormControl;

  results$: Observable<any>;

  modules$ = new BehaviorSubject<Module[]>([]);

  ngOnInit(): void {
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
        if (!(search || '').trim()) {
          return of({});
        }

        const result = {};

        result['SPOTLIGHT.MODULES'] = of(this.modules$.value.filter(module => {
          return !module.id.includes('{docId}')
            && !module.spotlight?.hide
            && (module.id.toLowerCase().includes(search.toLowerCase()) || module.name.toLowerCase().includes(search.toLowerCase()));
        }).map(module => {
          return {
            href: `/m/${module.id}/overview`,
            value: module.name,
            description: module.id,
          };
        }));

        result['SPOTLIGHT.DOCUMENTS'] = this.modules$.pipe(
          map(modules => {
            return modules.filter(module => {
              return !module.spotlight?.hide;
            }).map(module => {
              return {
                ...module,
                spotlight: module.spotlight || {
                  queryFields: ['name']
                }
              };
            });
          }),
          switchMap((modules: Module[]) => {
            return forkJoin(modules.map(module => {
              const fields = module.spotlight.queryFields.reduce((final, field) => {
                if (!final.includes(field)) {
                  final.push(field);
                }

                return final;
              }, ['id']);

              return forkJoin(fields.map(field => {
                if (field === 'id') {
                  try {
                    return this.db.getDocument(module.id, search).pipe(
                      catchError(() => {
                        return of(false);
                      }),
                      map(item => {
                        if (String(Object.keys(item)) === 'id') {
                          return false;
                        }

                        return item;
                      })
                    );
                  } catch (error) {
                    return of(false);
                  }
                } else {
                  return of(false);
                }

              })).pipe(
                map((items) => {
                  const res = items.filter(item => !!item).map((item: any) => {
                    return {
                      href: `/m/${module.id}/single/${item.id}`,
                      value: item.id,
                      description: `Document - ${module.id}`
                    }
                  });
                  return res.length ? res[0] : false;
                })
              );
            }));
          }),
          map((results) => results.filter(item => !!item))
        );

        const keys = Object.keys(result);
        return combineLatest(keys.map(key => result[key].pipe(startWith(null)))).pipe(
          map((results: any[]) => {
            return keys.reduce((hash, key, i) => {

              if (results[i] && results[i].length) {
                hash[key] = results[i];
              }

              return hash;
            }, {});
          })
        );
      })
    );
  }

  selectItem(event) {
    const item = event.option.value;
    return this.router.navigate([item.href]).then(() => {
      this.dialog.closeAll();
    });
  }
}
