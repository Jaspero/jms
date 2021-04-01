import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Layout} from '../../interfaces/layout.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class SchemaService {
  modules$ = of([]);

  layout$: Observable<Layout & {id: string}> = of(null);
}
