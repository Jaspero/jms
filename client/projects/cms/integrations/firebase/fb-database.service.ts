import {Injectable} from '@angular/core';
import {
  collection,
  collectionChanges,
  collectionGroup,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where
} from '@angular/fire/firestore';
import {Functions, httpsCallableData} from '@angular/fire/functions';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FilterMethod} from 'definitions';
import {WhereFilter} from '../../src/app/shared/interfaces/where-filter.interface';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {environment} from '../../src/environments/environment';
import {STATIC_CONFIG} from '../../src/environments/static-config';

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
        STATIC_CONFIG.cloudRegion,
        url
      ]
        .join('/');
    } else {
      return `https://${STATIC_CONFIG.cloudRegion}-${environment.firebase.projectId}.cloudfunctions.net/${url}`;
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
        this.collection(moduleId, pageSize, sort, cursor, this.filterMethod(filters), collectionGroup)
      )
    )
      .pipe(
        map((res: any) =>
          res.docs
        )
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
    return collectionChanges(
      this.collection(
        moduleId,
        pageSize,
        sort,
        cursor,
        this.filterMethod(filters),
        collectionGroup
      )
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
        } as any))
      );

  }

  getDocumentsSimple(moduleId, sort?, filter?) {
    return from(
      getDocs(
        query(
          collection(this.firestore, moduleId),
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
        )
      );
  }

  getSubdocumentsSimple(moduleId, sort?, filter?) {
    return from(
      getDocs(
        query(
          collectionGroup(this.firestore, moduleId),
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
        )
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

    const methods = [
      sort && orderBy(sort.active, sort.direction),
      ...(filters ? filters : []),
      pageSize && limit(pageSize),
      cursor && startAfter(cursor)
    ]
      .filter(it => it);

    if (cg) {

      return query(
        collectionGroup(this.firestore, moduleId),
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
