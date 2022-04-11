import {Injectable, NgZone} from '@angular/core';
import {DriveItem} from 'definitions';
import {deleteObject, getStorage, ref, uploadBytesResumable, UploadTask} from '@angular/fire/storage';
import {random} from '@jaspero/utils';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {FbStorageService} from '../../../../../../../../integrations/firebase/fb-storage.service';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {saveAs} from 'file-saver';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  uploads$ = new BehaviorSubject([]);
  downloads$ = new BehaviorSubject([]);
  uploadProcesses: {[key: string]: UploadTask} = {};
  downloadProcesses: {[key: string]: Subscription} = {};

  constructor(
    private storage: FbStorageService,
    private db: DbService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
  }

  downloadItem(item: DriveItem) {
    if (item.type === 'folder') {
      return console.log('Cannot download folder');
    }

    const storageInstance = getStorage();
    const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;

    const id = random.string(8);

    const percent$ = new BehaviorSubject(0);

    this.ngZone.run(() => {
      this.downloads$.next([...this.downloads$.value, {
        name: item.name,
        url: '',
        percent$,
        id
      }]);
    });

    this.storage.getDownloadURL(ref(storageInstance, path)).then(async (url) => {

      this.downloads$.next(
        this.downloads$.value.map(download => {
          if (download.id === id) {
            download.url = url;
          }
          return download;
        })
      );

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
            this.ngZone.run(() => {
              percent$.next(percent);
            });
          }

          if (result.type === HttpEventType.Response) {
            this.downloadProcesses[id]?.unsubscribe();
            saveAs(result.body, item.name);
          }
        })
      ).subscribe();
    });
  }

  stopDownload(download) {
    this.downloadProcesses[download.id]?.unsubscribe();
    this.downloads$.next(this.downloads$.value.filter(it => it.id !== download.id));
  }

  closeDownloads() {
    this.downloads$.next([]);
  }

  stopUpload(upload) {
    this.uploadProcesses[upload.id]?.cancel();
    this.uploads$.next(this.uploads$.value.filter(it => it.id !== upload.id));
  }

  closeUploads() {
    this.uploads$.next([]);
  }

  uploadFiles(path: string, files: FileList) {
    if (!files.length) {
      return;
    }

    const storageInstance = getStorage();

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      const id = random.string(8);
      const percent$ = new BehaviorSubject(0);

      this.ngZone.run(() => {
        this.uploads$.next([
          ...this.uploads$.value,
          {
            name: file.name,
            path,
            percent$,
            id
          }
        ]);
      });

      this.uploadProcesses[id] = uploadBytesResumable(ref(storageInstance, path + '/' + file.name), file);

      this.uploadProcesses[id].on('state_changed', (snapshot) => {
        const percent = snapshot.totalBytes
          ? Number(((100 * snapshot.bytesTransferred / snapshot.totalBytes)).toFixed(1))
          : 100;

        this.ngZone.run(() => {
          percent$.next(percent);
        });
      });
    }
  }

  async removeItem(item: DriveItem) {
    const storageInstance = getStorage();

    const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;
    await deleteObject(ref(storageInstance, path));
  }
}
