import {Pipe, PipeTransform} from '@angular/core';
import {StorageItem} from '@definitions';

@Pipe({
  name: 'fileIcon'
})
export class FileIconPipe implements PipeTransform {

  transform(file: string | StorageItem): { name: string, color: string } {
    const type = typeof file === 'string' ? file : file?.contentType;

    const defaultColor = 'rgba(0, 0, 0, 0.65)';

    if (type === 'application/pdf') {
      return {
        name: 'picture_as_pdf',
        color: '#d9534f'
      };
    }

    if (type === 'application/zip' || type === 'application/vnd.rar') {
      return {
        name: 'inventory_2',
        color: '#5bc0de'
      };
    }

    if (type === 'application/json') {
      return {
        name: 'library_books',
        color: '#5cb85c'
      };
    }

    if (type === 'application/msword') {
      return {
        name: 'description',
        color: defaultColor
      };
    }

    if (type.startsWith('image/')) {
      return {
        name: 'insert_photo',
        color: defaultColor
      };
    }

    if (type.startsWith('text/')) {
      return {
        name: 'article',
        color: defaultColor
      };
    }

    if (type.startsWith('audio/')) {
      return {
        name: 'headphones',
        color: defaultColor
      };
    }

    if (type.startsWith('video/')) {
      return {
        name: 'movie',
        color: defaultColor
      };
    }

    if (type.startsWith('font/')) {
      return {
        name: 'text_fields',
        color: defaultColor
      };
    }

    return {
      name: 'note',
      color: defaultColor
    };
  }
}
