import {QuerySnapshot} from '@angular/fire/firestore';
import {defer, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function snapshotsMap<T = any>(includeId = true): (source$: Observable<QuerySnapshot<T>>) => Observable<T[]> {
  return (source$: Observable<QuerySnapshot<T>>) =>
    defer(() => {
      return source$.pipe(
        map((data: QuerySnapshot<T>) => {
          return data.docs.map(snap => {
            return ({
              ...snap.data(),
              ...(includeId ? {id: snap.id} : {})
            });
          }) as T[];
        })
      );
    });
}
