import {Injectable} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {FilterMethod} from '@definitions';
import {forkJoin, from} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {relevantSearch} from '../../utils/relevant-search';
import {DbService} from '../db/db.service';
import {StateService} from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    public state: StateService,
    public transloco: TranslocoService,
    private db: DbService
    // public afs: AngularFirestore
  ) { }

  /**
   * ID of the currently open document
   */
  docId: string;

  init() {
    if (!window.jms) {
      window.jms = {
        util: this
      };
      return;
    }

    window.jms.util = this;
  }

  /**
   * Used when relevantSearch is needed on ref fields
   */
  refSearch(
    col: string,
    query: string,
    limit: number,
    cursor: any,
    meta: any
  ) {
    if (query) {
      return from(relevantSearch({
        col,
        query,
        limit,
        startId: cursor?.id
      }))
        .pipe(
          switchMap(results =>
            forkJoin(results.map(item => this.db.getDocument(col, item.id)))
          ),
          map((results: any[]) =>
            results.map(({id, ...data}) => ({
              id,
              data: () => data
            }))
          )
        );
    }

    return this.db.getDocuments(
      col,
      limit,
      undefined,
      cursor,
      [
        ...meta.filters
          .map(filter =>
            typeof filter === 'function'
              ? filter({
                fieldData: meta,
                value: meta.form.getRawValue(),
                role: this.state.role
              })
              : filter
          )
          .filter(it => !!it),
        {
          key: meta.search.key.slice(1),
          label: meta.search.label,
          operator: FilterMethod.GreaterThenOrEqual,
          value: query
        },
        {
          key: meta.search.key.slice(1),
          label: meta.search.label,
          operator: FilterMethod.LessThen,
          value: query.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))
        }
      ]
    );
  }
}
