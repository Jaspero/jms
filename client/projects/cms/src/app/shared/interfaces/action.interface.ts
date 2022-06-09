import {Observable} from 'rxjs';

export type Action<T = any> = (it: any) => {
  criteria?: Observable<(d: any) => boolean>;
  value: Observable<(d: T) => string>;
};
