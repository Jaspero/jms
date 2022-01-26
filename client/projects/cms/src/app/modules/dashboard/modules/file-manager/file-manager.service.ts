import {Injectable} from '@angular/core';
import {deleteObject, getDownloadURL, list, ref, Storage, uploadBytesResumable} from '@angular/fire/storage';
import {from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class FileManagerService {
  constructor(
    private storage: Storage
  ) {}

  cache: {[key: string]: any} = {};

  get ref() {
    return ref(this.storage);
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
    try {
      await getDownloadURL(ref(this.storage, route + file.name));

      const [extension, ...name] = file.name.split('.').reverse();

      const copyFile = name.reverse().join('.') + ' (' + (Date.now() + '').slice(-4) + ')' + '.' + extension;
      route += copyFile;
    } catch (error) {
      route += file.name;
    }

    const uploadTask = uploadBytesResumable(ref(this.storage, route), file);

    delete this.cache[route];

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

}
