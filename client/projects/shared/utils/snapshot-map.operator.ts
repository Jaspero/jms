import {DocumentSnapshot} from '@angular/fire/firestore';
import {defer, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function snapshotMap<T = any>(includeId = true): (source$) => Observable<T> {
  return (source$: Observable<DocumentSnapshot<T>>) =>
    defer(() => {
      return source$.pipe(
        map((snap: DocumentSnapshot<T>) => {
          const data = snap.data();
          return data && {
            ...data,
            ...(includeId && data ? {id: snap.id} : {})
          } as T;
        })
      );
    });
}
