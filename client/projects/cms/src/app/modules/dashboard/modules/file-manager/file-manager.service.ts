import {Injectable} from '@angular/core';
import {deleteObject, getDownloadURL, list, ref, Storage, updateMetadata, uploadBytesResumable} from '@angular/fire/storage';
import {from, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {DbService} from '../../../../shared/services/db/db.service';

@Injectable({providedIn: 'root'})
export class FileManagerService {
  constructor(
    private storage: Storage,
    private db: DbService
  ) {}

  cache: {[key: string]: any} = {};

  get ref() {
    return ref(this.storage);
  }

  adjustedFolderPath(path: string) {
    return path
      .split('/')
      .join('/folders/')
      .replace(/^\//, '') + '/folders';
  }

  getFolders(path: string) {
    return this.db.getDocumentsSimple(
      this.adjustedFolderPath(path)
    )
  }

  createFolder(path: string, folder: {name: string}) {
    const id = folder.name
      .toLowerCase()
      .trim()
      .replace(/ /g, '-');

    return this.db.setDocument(
      this.adjustedFolderPath(path),
      id,
      {
        createdOn: Date.now(),
        name: folder.name
      }
    )
      .pipe(
        map(() => id)
      )
  }

  list(path: string, pageToken: string, maxResults = 100) {
    if (this.cache[path]) {
      return of(this.cache[path]);
    }

    return from(list(ref(this.ref, path), {maxResults, pageToken}))
      .pipe(
        tap(resp => {
          this.cache[path] = resp;
        })
      );
  }

  async upload(route: string, file: File) {

    delete this.cache[route];

    if (!route.endsWith('/')) {
      route += '/';
    }

    try {
      await getDownloadURL(ref(this.storage, route + file.name));

      const [extension, ...name] = file.name.split('.').reverse();

      const copyFile = name.reverse().join('.') + ' (' + (Date.now() + '').slice(-4) + ')' + '.' + extension;
      route += copyFile;
    } catch (error) {
      route += file.name;
    }

    const uploadTask = uploadBytesResumable(ref(this.storage, route), file);

    return {
      progress: new Observable<{complete?: boolean, status: string, progress: number}>(obs => {
        uploadTask.on('state_changed',
          snapshot => obs.next({status: snapshot.state, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100}),
          error => obs.error(error),
          () => {
            obs.next({status: 'success', progress: 0, complete: true});
            obs.complete();
          }
        );
      }),
      uploadTask
    };
  }

  deleteFile(path: string) {
    return from(deleteObject(ref(this.ref, path)))
      .pipe(
        tap(() =>
          this.cache = {}
        )
      );
  }

  deleteFolder(path: string) {

    let pageToken = null;

    const deleteSubFiles = () => {

      return list(ref(this.ref, path), {
        maxResults: 100,
        pageToken
      })
        .then(response => {
          pageToken = response.nextPageToken;

          if (response.items.length) {
            return Promise.all(response.items.map(item => deleteObject(item)))
              .then(() => deleteSubFiles());
          }

          return Promise.resolve(null);
        });
    };

    return from(deleteSubFiles())
      .pipe(
        tap(() =>
          this.cache = {}
        )
      );
  }

  updateMetadata(path: string, meta: any) {
    return from(updateMetadata(ref(this.ref, path), meta))
  }
}
