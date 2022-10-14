import {
  collection,
  doc,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query as fsQuery,
  startAfter
} from '@angular/fire/firestore';

/**
 * Relevant search callable function
 * @param _opts {
 *   query - query to search
 *   col - collection to search
 *   fields - fields to search
 *   searchCol - name of search collection, default _search
 *   termField - name of term field to search, default _term
 *   filterFunc - name of function to filter
 *   limit - number of search results to limit, default 10
 *   startId - id field for paging, only works with _all index
 * }
 * @retuns - will return a sorted array of docs with {id, relevance}
 *   the higher the relevance, the better match it is...
 */
export async function relevantSearch(
  _opts: {
    query: string;
    col: string;
    fields?: string | string[];
    searchCol?: string;
    termField?: string;
    filterFunc?: any;
    limit?: number;
    startId?: string;
  }
) {
  const opts = {
    fields: _opts.fields || ['_all'],
    col: _opts.col,
    query: _opts.query,
    searchCol: _opts.searchCol || '_search',
    termField: _opts.termField || '_term',
    filterFunc: _opts.filterFunc,
    limit: _opts.limit || 10,
    startId: _opts.startId
  };

  const firestore: Firestore = (window as any).rootInjector.get(Firestore);

  const exp = opts.filterFunc
    ? opts.query.split(' ').map((v: string) => opts.filterFunc(v)).join(' ')
    : opts.query;

  if (typeof opts.fields === 'string') {
    opts.fields = [opts.fields];
  }

  if (opts.fields[0] === '_all') {

    // if start id
    const start = opts.startId
      ? doc(firestore, `${opts.searchCol}/${opts.col}/_all/${opts.startId}`)
      : [];

    // const query = db.collection(`${opts.searchCol}/${opts.col}/_all`)
    //   .orderBy(`${opts.termField}.${exp}`, 'desc').limit(opts.limit).startAfter(start);

    const query = getDocs(
      fsQuery(
        collection(firestore, `${opts.searchCol}/${opts.col}/_all`),
        orderBy(`${opts.termField}.${exp}`, 'desc'),
        limit(opts.limit),
        startAfter(start)
      )
    );

    // getDocs(
    //   query(
    //     collection(this.firestore, moduleId),
    //     ...[
    //       sort && orderBy(sort.active, sort.direction),
    //       filter && where(filter.key, filter.operator, filter.value)
    //     ]
    //       .filter(it => it)
    //   )
    // )

    // return results
    const docsSnap = await query;

    return docsSnap.docs.map((document: any) => {
      const data = document.data();
      const id = document.id;
      const relevance = data._term[exp];
      return {id, relevance};
    });
  }

  // get queries for each field
  const s: any = [];

  for (const field of opts.fields) {
    const query = getDocs(
      fsQuery(
        collection(firestore, `${opts.searchCol}/${opts.col}/${field}`),
        orderBy(`${opts.termField}.${exp}`, 'desc'),
        limit(opts.limit)
      )
    );

    s.push(query);
  }
  
  const docsSnaps: any = await Promise.all(s);
  const ids: any = {};
  let i = 0;

  // return merged results
  return [].concat.apply([], docsSnaps.map((q: any) => {
    // get relevant info from docs
    return q.docs.map((document: any) => {
      const data = document.data();
      const id = document.id;
      const relevance = data._term[exp];
      return {id, relevance};
    });
  }))
    .filter((r: any) => {
      // filter duplicates
      if (ids[r.id]) {
        ids[r.id] += r.relevance;
        return;
      }
      ids[r.id] = r.relevance;
      return r;
    })
    .map((r: any) => {
      // merge relevances
      r.relevance = ids[r.id];
      return r;
      // sort by relevance again
    })
    .sort((a: any, b: any) => b.relevance < a.relevance ? -1 : a.relevance ? 1 : 0)
    .filter((r: any) => {
      // limit opts.limit
      if (i < opts.limit) {
        ++i;
        return r;
      }
      return;
    });
}
