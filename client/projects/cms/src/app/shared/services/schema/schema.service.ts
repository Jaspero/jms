import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Layout} from '../../interfaces/layout.interface';
import {Module} from '../../interfaces/module.interface';

@Injectable({providedIn: 'root'})
export abstract class SchemaService {
  modules$: Observable<Module[]> = of([]);
  layout$: Observable<Layout & {id: string}> = of(null);
}
