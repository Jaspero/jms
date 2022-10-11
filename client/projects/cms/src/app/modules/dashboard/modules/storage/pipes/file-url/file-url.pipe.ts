import {Pipe, PipeTransform} from '@angular/core';
import {StorageItem} from '@definitions';
import {FbStorageService} from '../../../../../../../../integrations/firebase/fb-storage.service';
import {ref, Storage} from '@angular/fire/storage';
import {from, Observable} from 'rxjs';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {
  constructor(
    private storageService: FbStorageService,
    public storage: Storage
  ) {}

  transform(file: StorageItem): Observable<string> {
    const path = file.path === '.' ? file.name : file.path + '/' + file.name;
    return from(this.storageService.getDownloadURL(ref(this.storage, path)));
  }
}
