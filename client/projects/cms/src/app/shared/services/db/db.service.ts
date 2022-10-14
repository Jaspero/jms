import {Injectable} from '@angular/core';
import {InstanceSort} from '@definitions';
import {Observable, of} from 'rxjs';
import {WhereFilter} from '../../interfaces/where-filter.interface';

@Injectable({providedIn: 'root'})
export abstract class DbService {

  url(url: string) {
    return url;
  }

  getDocuments(
    moduleId: string,
    pageSize?: number,
    sort?: InstanceSort | InstanceSort[],
    cursor?: any,
    filters?: WhereFilter[],
    source?: string,
    collectionGroup?: boolean
  ): Observable<any[]> {
    return of([]);
  }

  getDocumentsSimple(
    moduleId: string,
    orderBy?: string,
    filter?: WhereFilter
  ): Observable<any[]> {
    return of([]);
  }

  getSubdocumentsSimple(
    moduleId: string,
    orderBy?: string,
    filter?: WhereFilter
  ): Observable<any[]> {
    return of([]);
  }

  getStateChanges(
    moduleId: string,
    pageSize?: number,
    sort?: InstanceSort | InstanceSort[],
    cursor?: any,
    filters?: WhereFilter[],
    collectionGroup?: boolean
  ): Observable<any[]> {
    return of([]);
  }

  getValueChanges(
    moduleId: string,
    pageSize?: number,
    sort?: InstanceSort | InstanceSort[],
    cursor?: any,
    filters?: WhereFilter[],
    collectionGroup?: boolean
  ): Observable<any[]> {
    return of([]);
  }

  getDocument<T = any>(
    moduleId: string,
    documentId: string,
    stream = false
  ): Observable<T> {
    return of(null);
  }

  setDocument(
    moduleId: string,
    documentId: string,
    data: any,
    options?: any
  ): Observable<void> {
    return of();
  }

  removeDocument(moduleId: string, documentId: string): Observable<void> {
    return of();
  }

  createUserAccount(email: string, password: string): Observable<{id: string}> {
    return of();
  }

  removeUserAccount(id: string): Observable<any> {
    return of();
  }

  callFunction(name: string, data: any): Observable<any> {
    return of();
  }
}
