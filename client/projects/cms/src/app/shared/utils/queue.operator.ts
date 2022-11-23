import {defer, Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {StateService} from '../services/state/state.service';

const cq = [];

export function addToQueue(name?: string | number) {
  const state: StateService = (window as any).rootInjector.get(StateService);

  name = name || new Date().getTime() + Math.random();
  cq.push(name);
  state.loadingQue$.next(cq);

  return name;
}

export function removeFromQueue(name: string | number) {
  const state: StateService = (window as any).rootInjector.get(StateService);
  const index = cq.indexOf(name);

  if (index !== -1) {
    cq.splice(index, 1);
  }

  state.loadingQue$.next(cq);
}

export function queue(
  name?: string | number
): <T>(source$: Observable<T>) => Observable<T> {
  return <T>(source$: Observable<T>) => {
    return defer(() => {
      name = addToQueue(name);

      return source$.pipe(
        finalize(() =>
          removeFromQueue(name)
        ),
        catchError(err => {
          removeFromQueue(name);
          return throwError(() => err);
        })
      );
    });
  };

}
