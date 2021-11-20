import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import {from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class FileManagerService {

  cache: {[key: string]: any} = {};
  
  get ref() {
    return firebase.storage().ref();
  }

  list(path: string, pageToken: string, maxResults = 100) {
    if (this.cache[path]) {
      return of(this.cache[path]);
    }

    return from(this.ref.child(path).list({maxResults, pageToken}))
      .pipe(
        tap(resp => {
          this.cache[path] = resp;
        })
      );
  }

  async upload(route: string, file: File) {
    try {
      const ref = firebase.storage().ref(route + file.name);
      await ref.getDownloadURL();

      const [extension, ...name] = file.name.split('.').reverse();

      const copyFile = name.reverse().join('.') + ' (' + (Date.now() + '').slice(-4) + ')' + '.' + extension;
      route += copyFile;
    } catch (error) {
      route += file.name;
    }

    const uploadTask = firebase.storage().ref(route).put(file);

    delete this.cache[route];
    
    return {
      progress: new Observable<{complete?: boolean, status: string, progress: number}>(obs => {
        uploadTask.on('state_changed',
          snapshot =>
            obs.next({status: snapshot.state, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100}),
          error => obs.error(error),
          () => {
            obs.next({status: firebase.storage.TaskState.SUCCESS, progress: 0, complete: true});
            obs.complete();
          }
        );
      }),
      uploadTask
    };
  }

  deleteFile(path: string) {
    return from(this.ref.child(path).delete())
      .pipe(
        tap(() => 
          delete this.cache[path]
        )
      )
  }

  deleteFolder(path: string) {

    let pageToken = null;

    const deleteSubFiles = () => {

      return this.ref.child(path).list({
        maxResults: 100,
        pageToken
      })
        .then(response => {
          pageToken = response.nextPageToken;

          if (response.items.length) {
            return Promise.all(response.items.map(item => item.delete()))
              .then(() => deleteSubFiles());
          }

          return Promise.resolve(null);
        });
    }

    return from(deleteSubFiles())
      .pipe(
        tap(() => 
          delete this.cache[path]
        )
      );
  }

}
