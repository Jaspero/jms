import {Pipe, PipeTransform} from '@angular/core';
import {DriveItem} from 'definitions';

@Pipe({
  name: 'fileIcon'
})
export class FileIconPipe implements PipeTransform {

  transform(file: string | DriveItem): string {
    const type = typeof file === 'string' ? file : file?.contentType;

    if (type === 'application/pdf') {
      return 'picture_as_pdf';
    }

    if (type === 'application/zip' || type === 'application/vnd.rar') {
      return 'inventory_2';
    }

    if (type === 'application/json') {
      return 'library_books';
    }

    if (type === 'application/msword') {
      return 'description';
    }

    if (type.startsWith('image/')) {
      return 'insert_photo';
    }

    if (type.startsWith('text/')) {
      return 'article';
    }

    if (type.startsWith('audio/')) {
      return 'headphones';
    }

    if (type.startsWith('video/')) {
      return 'movie';
    }

    if (type.startsWith('font/')) {
      return 'text_fields';
    }

    return 'note';
  }
}
