import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  collectionGroup as collectionGroupFn,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  where
} from '@angular/fire/firestore';
import {Functions, httpsCallableData} from '@angular/fire/functions';
import {FilterMethod, SHARED_CONFIG} from '@definitions';
import {Parser} from '@jaspero/form-builder';
import {from, Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {WhereFilter} from '../../src/app/shared/interfaces/where-filter.interface';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {environment} from '../../src/environments/environment';

@Injectable()
export class FbDatabaseService extends DbService {
  constructor(
    private firestore: Firestore,
    private functions: Functions
  ) {
    super();
  }

  url(url: string) {

    if (environment.origin) {
      return [
        environment.origin,
        environment.firebase.projectId,
        SHARED_CONFIG.cloudRegion,
        url
      ]
        .join('/');
    } else {
      return `https://${SHARED_CONFIG.cloudRegion}-${environment.firebase.projectId}.cloudfunctions.net/${url}`;
    }
  }

  getDocuments(
    moduleId,
    pageSize,
    sort?,
    cursor?,
    filters?,
    source?,
    collectionGroup?
  ) {
    const sources = {
      server: getDocsFromServer,
      cache: getDocsFromCache
    };
    const method = source ? sources[source] : getDocs;

    return from(
      method(
        this.collection(moduleId, pageSize, sort, cursor, filters, collectionGroup)
      )
    )
      .pipe(
        map((res: any) =>
          res.docs
        ),
        catchError(() => of([]))
      );
  }

  getStateChanges(
    moduleId,
    pageSize?,
    sort?,
    cursor?,
    filters?: WhereFilter[],
    collectionGroup?
  ) {
    return new Observable(observer =>
      onSnapshot(
        this.collection(
          moduleId,
          pageSize,
          sort,
          cursor,
          filters,
          collectionGroup
        ),
        snap => {
          const docs = snap.docChanges().filter(it => !it.doc.metadata.hasPendingWrites);
          if (docs.length) {
            observer.next(docs);
          }
        })
    ) as Observable<any>;
  }

  getValueChanges(
    moduleId,
    pageSize?,
    sort?,
    cursor?,
    filters?: WhereFilter[],
    collectionGroup?
  ) {
    return collectionData(
      this.collection(
        moduleId,
        pageSize,
        sort,
        cursor,
        filters,
        collectionGroup
      ),
      {
        idField: 'id'
      }
    );
  }

  getDocument<T = any>(
    moduleId,
    documentId,
    stream = false
  ): Observable<T> {
    if (stream) {
      return docData<T>(
        doc(
          this.firestore,
          moduleId,
          documentId
        ) as any,
        {idField: 'id'}
      );
    }

    return from(
      getDoc(
        doc(
          this.firestore,
          moduleId,
          documentId
        )
      )
    )
      .pipe(
        map(snap => ({
          ...snap.data(),
          id: documentId
        } as any)),
        catchError(error => {

          if (error.code === 'permission-denied') {
            return throwError(() => new Error(`Firebase permission denied thrown while pulling module: ${moduleId} and document: ${documentId}`));
          }

          return throwError(() => error);
        })
      );

  }

  getDocumentsSimple(moduleId, sort?, filter?) {
    return from(
      getDocs(
        query(
          collection(this.firestore, moduleId),
          ...[
            sort && orderBy(sort, 'asc'),
            filter && where(filter.key, filter.operator, filter.value)
          ]
            .filter(it => it)
        )
      )
    )
      .pipe(
        map(data =>
          data.docs.map((it: any) => ({
            id: it.id,
            ...it.data()
          }))
        ),
        catchError(() => of([]))
      );
  }

  getSubdocumentsSimple(moduleId, sort?, filter?) {
    return from(
      getDocs(
        query(
          collectionGroupFn(this.firestore, moduleId),
          ...[
            sort && orderBy(sort.active, sort.direction),
            filter && where(filter.key, filter.operator, filter.value)
          ]
            .filter(it => it)
        )
      )
    )
      .pipe(
        map(data =>
          data.docs.map((it: any) => ({
            id: it.id,
            ...it.data()
          }))
        ),
        catchError(() => of([]))
      );
  }

  setDocument(moduleId, documentId, data, options) {
    return from(
      setDoc(
        doc(
          this.firestore,
          moduleId,
          documentId
        ),
        data,
        options || {}
      )
    );
  }

  removeDocument(moduleId, documentId) {
    return from(
      deleteDoc(
        doc(
          this.firestore,
          moduleId,
          documentId
        )
      )
    );
  }

  createUserAccount(email: string, password: string) {
    return this.callFunction('cms-createUser', {email, password}) as any;
  }

  removeUserAccount(id: string) {
    return this.callFunction('cms-removeUser', {id});
  }

  callFunction(name: string, data) {
    return httpsCallableData(this.functions, name)(data);
  }

  private collection(
    moduleId,
    pageSize,
    sort,
    cursor,
    filters?: any[],
    cg?
  ) {

    if (Array.isArray(sort)) {
      sort = [...sort].map(s => {
        s.active = Parser.standardizeKey(s.active);
        return s;
      });
    } else if (sort?.active) {
      sort.active = Parser.standardizeKey(sort.active);
    }

    /**
     * In firebase we can't sort by the
     * key we filter with.
     */
    if (
      filters?.length &&
      (Array.isArray(sort) || sort?.active) &&
      filters.some(it => Array.isArray(sort) ? sort.some(s => s.active === it.key) : it.key === sort.active)
    ) {
      sort = null;
    }

    const methods = [
      ...sort ? Array.isArray(sort) ? sort.map(it => orderBy(it.active, it.direction)) : [orderBy(sort.active, sort.direction)] : [],
      ...this.filterMethod(filters || []),
      pageSize && limit(pageSize),
      cursor && startAfter(cursor)
    ]
      .filter(it => it);

    if (cg) {

      return query(
        collectionGroupFn(this.firestore, moduleId),
        ...methods
      );
    }

    return query(
      collection(this.firestore, moduleId),
      ...methods
    );
  }

  private filterMethod(filters?: WhereFilter[]) {
    if (filters) {
      return filters.reduce((acc, item) => {
        if (
          item.skipFalsyValueCheck ||
          (
            item.value !== undefined &&
            item.value !== null &&
            !Number.isNaN(item.value) &&
            item.value !== '' &&
            (
              (
                item.operator === FilterMethod.ArrayContains ||
                item.operator === FilterMethod.ArrayContainsAny ||
                item.operator === FilterMethod.In
              ) && Array.isArray(item.value) ?
                item.value.length :
                true
            )
          )
        ) {
          acc.push(
            where(item.key, item.operator, item.value)
          );
        }

        return acc;
      }, []);
    }

    return [];
  }
}
