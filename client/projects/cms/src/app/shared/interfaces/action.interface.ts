import {Observable} from 'rxjs';

export type Action<T = any> = {
  criteria?: Observable<{value: boolean}>;
  value: Observable<(d: T) => string>;
  children?: Action[];
  menuStyle?: boolean;
};
