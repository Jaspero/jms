import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class EllipsisPipe implements PipeTransform {
  transform(value: string, length = 20): any {
    return value.length > length ? value.slice(0, length) + '...' : value;
  }
}
