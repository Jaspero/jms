import {defer, Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {loadingQueue$} from '../../modules/dashboard/modules/module-instance/utils/loading-queue';

const cq = [];

export function addToQueue(name?: string | number) {
  name = name || new Date().getTime() + Math.random();
  cq.push(name);
  loadingQueue$.next(cq);

  return name;
}

export function removeFromQueue(name: string | number) {
  const index = cq.indexOf(name);

  if (index !== -1) {
    cq.splice(index, 1);
  }

  loadingQueue$.next(cq);
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
