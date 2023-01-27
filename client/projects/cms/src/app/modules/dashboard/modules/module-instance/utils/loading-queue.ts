import {Subject} from 'rxjs';

export const loadingQueue$ = new Subject<Array<string | boolean>>();