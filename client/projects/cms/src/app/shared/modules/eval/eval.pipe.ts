import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'eval'})
export class EvalPipe implements PipeTransform {
  transform<T>(value: (...args) => T, ...args: any[]): T {
    return value(...args);
  }
}
