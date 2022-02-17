import {Inject, Injectable, Optional} from '@angular/core';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {snapshotMap} from '@shared/utils/snapshot-map.operator';
import {from, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {BASE_TITLE} from '../../../web/src/app/consts/base-title.const';
import {INITIAL_STATE} from '../../consts/initial-state.const';

@Injectable()
export class PageResolver implements Resolve<any> {
  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private firestore: Firestore,
    @Optional()
    @Inject('LANG_SUFFIX')
    private langSuffix: string
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const {collection, skipMeta, langSuffix} = route.data;
    const {id = route.data.id} = route.params;
    const suffix = langSuffix !== undefined ? langSuffix : (this.langSuffix ? ('-' + this.langSuffix) : '');

    return this.getItem(id, collection + suffix).pipe(
      map((page: any) => {
        if (!page || !page.active) {
          this.router.navigate(['/404']);
          return;
        }

        if (!skipMeta) {
          const valuesToSet = {...(page.meta || {})};
          this.title.setTitle(
            valuesToSet.title
              ? `${valuesToSet.title} | ${BASE_TITLE}`
              : BASE_TITLE
          );

          /**
           * To prevent iterating over the title and adding it as meta
           */
          delete valuesToSet.title;

          /**
           * Written like this instead of Object.entries to support older browsers
           */
          for (const name in valuesToSet) {
            if (valuesToSet.hasOwnProperty(name)) {
              this.meta.updateTag({name, content: valuesToSet[name]});
            }
          }
        }

        return page;
      })
    );
  }

  private getItem(id: string, collection?: string): any {
    if (INITIAL_STATE?.collections[collection] && INITIAL_STATE.collections[collection][id]) {
      return of(INITIAL_STATE.collections[collection][id]);
    }

    return from(
      getDoc(
        doc(
          this.firestore,
          collection,
          id
        )
      )
    )
      .pipe(
        snapshotMap()
      );
  }
}
