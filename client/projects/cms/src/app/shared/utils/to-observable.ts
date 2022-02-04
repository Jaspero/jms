import {Observable, of} from 'rxjs';
import {isObservableLike} from './is-observable-like';

export function toObservable<T>(value: any): Observable<T> {
  return isObservableLike(value) ? value : of(value);
}
