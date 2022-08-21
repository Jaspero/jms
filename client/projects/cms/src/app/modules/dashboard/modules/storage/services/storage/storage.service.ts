import {Injectable, NgZone} from '@angular/core';
import {StorageItem, FilterMethod} from 'definitions';
import {deleteObject, getStorage, ref, uploadBytesResumable, UploadTask} from '@angular/fire/storage';
import {random} from '@jaspero/utils';
import {map, take, tap} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {FbStorageService} from '../../../../../../../../integrations/firebase/fb-storage.service';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {saveAs} from 'file-saver';
import {BehaviorSubject, Subscription} from 'rxjs';
import {StateService} from '../../../../../../shared/services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  uploads$ = new BehaviorSubject([]);
  downloads$ = new BehaviorSubject([]);
  uploadProcesses: {[key: string]: UploadTask} = {};
  downloadProcesses: {[key: string]: Subscription} = {};

  constructor(
    private storage: FbStorageService,
    private db: DbService,
    private http: HttpClient,
    private ngZone: NgZone,
    private state: StateService
  ) {
  }

  downloadItem(item: StorageItem) {
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
        this.db.url('cms-proxy?url=' + encodeURIComponent(url)),
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

  async uploadFiles(path: string, files: FileList) {
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

      // permissions_public_read = false
      // permissions_public_write = false
      // permissions_roles_admin_read = false
      // permissions_roles_admin_write = false
      // permissions_users_123_read = false
      // permissions_users_123_write = false

      const metadata = {};

      if (path && path !== '.') {

        console.log(1);
        const parentPath = path.split('/').slice(0, -1).join('/') || '.';
        const parentName = path.split('/').slice(-1)[0];

        console.log({parentPath, parentName});

        console.log([
          {
            key: 'path',
            operator: FilterMethod.Equal,
            value: parentPath
          },
          {
            key: 'name',
            operator: FilterMethod.Equal,
            value: parentName
          }
        ]);

        const folders = await this.db.getDocuments('storage', undefined, undefined, undefined, [
          {
            key: 'path',
            operator: FilterMethod.Equal,
            value: parentPath
          },
          {
            key: 'name',
            operator: FilterMethod.Equal,
            value: parentName
          }
        ]).toPromise();

        console.log(2);

        const folder = folders[0]?.data?.();

        if (folder?.metadata) {
          for (const [key, value] of Object.entries(folder.metadata)) {
            if (key.startsWith('permissions_')) {
              metadata[key] = value;
            }
          }
        }
      }

      if (!Object.keys(metadata).length) {
        metadata[`permissions_users_${this.state.user.id}_write`] = 'true';
      }

      this.uploadProcesses[id] = uploadBytesResumable(ref(storageInstance, path + '/' + file.name), file, {
        customMetadata: metadata
      });

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

  async removeItem(item: StorageItem) {
    const storageInstance = getStorage();

    const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;
    try {
      await deleteObject(ref(storageInstance, path));
    } catch (e) {
      const itemDocument = await this.db.getDocuments('storage', undefined, undefined, undefined, [
        {
          key: 'path',
          operator: FilterMethod.Equal,
          value: item.path
        },
        {
          key: 'name',
          operator: FilterMethod.Equal,
          value: item.name
        }
      ]).pipe(
        take(1),
        map(docs => docs[0])
      ).toPromise();

      if (itemDocument?.id) {
        await this.db.removeDocument('storage', itemDocument.id);
      }
    }
  }

  hasPermission(item: StorageItem, permission?: 'read' | 'write') {

    const userId = this.state.user.id;
    const userRole = this.state.user.role;

    return Object.keys(item.metadata || {}).some((key) => {

      if (key.startsWith('permissions_') && item.metadata[key] === 'true') {
        const type = key.split('_')[1];
        const permissionType = key.split('_').slice(-1)[0];

        if (type === 'public') {
          if (!permission) {
            return true;
          }

          if (permissionType === permission) {
            return true;
          }
        } else if (type === 'roles') {

          const role = key.split('_')[2];

          if (!permission && role === userRole) {
            return true;
          }

          if (permissionType === permission && role === userRole) {
            return true;
          }
        } else if (type === 'users') {

          const userIdKey = key.split('_')[2];

          if (!permission && userIdKey === userId) {
            return true;
          }

          if (permissionType === permission && userIdKey === userId) {
            return true;
          }
        }
      }

      return false;
    });
  }
}
