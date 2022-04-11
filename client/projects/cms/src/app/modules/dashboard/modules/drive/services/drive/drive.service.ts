import {Injectable} from '@angular/core';
import {DriveItem} from 'definitions';
import {getStorage, ref} from '@angular/fire/storage';
import {random} from '@jaspero/utils';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {FbStorageService} from '../../../../../../../../integrations/firebase/fb-storage.service';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {saveAs} from 'file-saver';
import {BehaviorSubject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  constructor(
    private storage: FbStorageService,
    private db: DbService,
    private http: HttpClient
  ) {
  }

  downloads$ = new BehaviorSubject([]);

  downloadProcesses: {[key: string]: Subscription} = {};

  downloadItem(item: DriveItem) {
    if (item.type === 'folder') {
      return console.log('Cannot download folder');
    }

    const storageInstance = getStorage();
    const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;

    const id = random.string(8);

    this.storage.getDownloadURL(ref(storageInstance, path)).then(async (url) => {

      const percent$ = new BehaviorSubject(0);

      this.downloads$.next([...this.downloads$.value, {
        name: item.name,
        url,
        percent$,
        id
      }]);

      this.downloadProcesses[id] = this.http.get(
        this.db.url('cms-proxy/' + url),
        {
          responseType: 'blob',
          reportProgress: true,
          observe: 'events'
        }
      ).pipe(
        tap((result) => {
          if (result.type === HttpEventType.DownloadProgress) {
            const percent = Number((100 * result.loaded / result.total).toFixed(1));
            console.log(percent);

            percent$.next(percent);

            // this.downloads$.next(
            //   this.downloads$.value.map(it => {
            //     if (it.id === id) {
            //       return {
            //         ...it,
            //         percent
            //       };
            //     }
            //
            //     return it;
            //   })
            // );
          }
          if (result.type === HttpEventType.Response) {
            console.log('FINISHED');
            this.downloadProcesses[id]?.unsubscribe();
            saveAs(result.body, item.name);
            console.log(result.body);
          }
        })
      ).subscribe();
    });
  }

  stopDownload(download) {
    console.log('STOP DOWNLOAD', download);
    this.downloadProcesses[download.id]?.unsubscribe();
    this.downloads$.next(this.downloads$.value.filter(it => it.id !== download.id));
  }

  closeDownloads() {
    this.downloads$.next([]);
  }
}
