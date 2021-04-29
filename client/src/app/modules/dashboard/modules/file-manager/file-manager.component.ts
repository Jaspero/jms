import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {formatFileName} from '@jaspero/form-builder';
import firebase from 'firebase/app';
import 'firebase/storage';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {map, scan, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {Color} from '../../../../shared/enums/color.enum';
import {confirmation} from '../../../../shared/utils/confirmation';

@Component({
  selector: 'jms-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerComponent implements OnInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  @ViewChild('file')
  fileElement: ElementRef<HTMLInputElement>;

  @ViewChild('metadata')
  metadataDialogElement: TemplateRef<any>;
  metadataDialog: MatDialogRef<any>;

  @ViewChild('upload')
  uploadDialogElement: TemplateRef<any>;
  uploadDialog: MatDialogRef<any>;

  @ViewChild('newFolder')
  newFolderDialogElement: TemplateRef<any>;
  newFolderDialog: MatDialogRef<any>;

  @Input()
  uploadMode = false;

  @Input()
  dialogRef: MatDialogRef<any>;

  routeControl: FormControl;

  displayMode$ = new BehaviorSubject<'list' | 'grid'>('list');
  data$: Observable<{
    files: any[];
    folders: any[];
  }>;
  filteredFolders$: Observable<string[]>;
  loading$ = new BehaviorSubject(false);
  uploadProgress$ = new BehaviorSubject(0);
  activeFile$ = new BehaviorSubject<number>(-1);

  nextPageToken: string | undefined;
  loadMore = false;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.routeControl = new FormControl('/', {
      updateOn: 'blur'
    });

    this.data$ = this.routeControl.valueChanges.pipe(
      startWith(this.routeControl.value),
      switchMap(route => {
        this.loading$.next(true);
        this.activeFile$.next(-1);
        return firebase.storage().ref().child(route).list({
          maxResults: 100,
          pageToken: this.nextPageToken
        });
      }),
      switchMap(response => {
        this.nextPageToken = response.nextPageToken;
        return Promise.all([
          Promise.all(
            response.items.map(async item => {
              const metadata = await item.getMetadata();
              const downloadLink = await item.getDownloadURL();
              return {
                name: item.name,
                type: 'file',
                ...metadata,
                downloadLink,
                icon: this.typeToIcon(metadata.contentType)
              };
            })
          ),
          Promise.all(
            response.prefixes.map(async (item) => {
              return {
                name: item.name,
                type: 'folder',
                icon: 'folder'
              };
            })
          )
        ]);
      }),
      map(([files, folders]) => {
        return {
          files,
          folders
        };
      }),
      scan((data, item) => {
        if (this.loadMore) {
          data.files.push(...item.files);
          data.folders.push(...item.folders);
        } else {
          data = item;
        }

        this.loadMore = false;

        return data;
      }, {files: [], folders: []}),
      tap(() => this.loading$.next(false)),
      shareReplay(1)
    );
  }

  toggleDisplayMode() {
    const current = this.displayMode$.value;
    this.displayMode$.next(current === 'list' ? 'grid' : 'list');
  }

  typeToIcon(type = '') {
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

  navigateBack() {
    const route = this.routeControl.value.split('/').filter(it => it);
    route.pop();

    this.nextPageToken = undefined;
    this.routeControl.setValue('/' + route.join('/'));
  }

  appendFolder(folder: string) {
    let route: string = this.routeControl.value;
    if (!route.endsWith('/')) {
      route += '/';
    }
    route += folder;

    this.nextPageToken = undefined;
    this.routeControl.setValue(route);
  }

  downloadFile(file) {
    const link = document.createElement('a');
    link.setAttribute('download', file.name);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.href = file.downloadLink;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  deleteFile(file) {
    confirmation([
      switchMap(() => firebase.storage().ref(file.fullPath).delete()),
      tap(() => this.reset())
    ], {
      description: 'FILE_MANAGER.DELETE_FILE.DESCRIPTION',
      confirm: 'FILE_MANAGER.DELETE_FILE.CONFIRM',
      color: Color.Warn,
      variables: {
        name: file.name
      }
    });
  }

  editFileMetadata(file) {
    const keys = Object.keys(file.customMetadata || {});
    this.metadataDialog = this.dialog.open(this.metadataDialogElement, {
      autoFocus: false,
      data: {
        ...file,
        fb: {
          schema: {
            properties: keys.reduce((acc, key) => {
              acc[key] = {type: 'string'};
              return acc;
            }, {})
          },
          value: file.customMetadata || {a: '123'}
        }
      },
      width: '600px'
    });
  }

  openNewFolderDialog() {
    const form = this.fb.group({
      name: ['', Validators.required]
    });

    this.newFolderDialog = this.dialog.open(this.newFolderDialogElement, {
      autoFocus: true,
      width: '600px',
      data: {
        form
      }
    });
  }

  createNewFolder(form: FormGroup) {
    this.appendFolder(form.controls.name.value);

    this.newFolderDialog.close();
  }

  openUploadDialog() {
    const form = this.fb.group({
      route: [this.routeControl.value],
      file: [null, Validators.required],
      uploadTask: [null],
      paused: [false]
    });

    this.filteredFolders$ = combineLatest([
      this.data$,
      form.controls.route.valueChanges.pipe(startWith(form.controls.route.value))
    ]).pipe(
      map(([data, route]) => {
        /**
         * Cool comment
         */
        return data.folders.filter(folder => {
          return folder.name.toLowerCase().replace(/\//g, '').indexOf((route || '').replace(/\//g, '').toLowerCase()) > -1;
        }).map(folder => '/' + folder.name);
      })
    );

    this.uploadDialog = this.dialog.open(this.uploadDialogElement, {
      autoFocus: false,
      width: '600px',
      data: {
        form
      }
    });

    this.subscriptions.push(
      this.uploadDialog.afterClosed().pipe(
        tap(() => {
          this.uploadProgress$.next(0);
          const uploadTask = form.get('uploadTask').value;

          uploadTask?.cancel();
        })
      ).subscribe()
    );
  }

  openFileUpload() {
    this.fileElement.nativeElement.click();
  }

  fileChange(form: FormGroup) {
    const el = this.fileElement.nativeElement as HTMLInputElement;
    const file = Array.from(el.files as FileList)[0] as File;

    Object.defineProperty(file, 'name', {
      writable: true,
      value: formatFileName(file.name)
    });

    form.get('file').setValue(file.name);
  }

  async startUpload(form: FormGroup) {
    const el = this.fileElement.nativeElement as HTMLInputElement;
    const file = Array.from(el.files as FileList)[0] as File;

    Object.defineProperty(file, 'name', {
      writable: true,
      value: formatFileName(file.name)
    });

    form.get('file').setValue(file.name);

    let route = form.get('route').value;

    if (!route.endsWith('/')) {
      route += '/';
    }

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
    form.get('uploadTask').setValue(uploadTask);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.uploadProgress$.next(Number(progress.toFixed(2)));
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      (error) => {
        console.log({error});
      },
      () => {
        el.value = '';
        this.uploadDialog.close();
        this.reset();
        this.uploadProgress$.next(0);
      }
    );
  }

  cancelDownload(form: FormGroup) {
    form.get('paused').setValue(false);
    form.get('uploadTask').value.cancel();
    this.uploadDialog.close();
  }

  pauseDownload(form: FormGroup) {
    form.get('paused').setValue(true);
    form.get('uploadTask').value.pause();
  }

  resumeDownload(form: FormGroup) {
    form.get('paused').setValue(false);
    form.get('uploadTask').value.resume();
  }

  reset() {
    this.nextPageToken = undefined;
    this.routeControl.setValue(this.routeControl.value);
  }

  loadMoreFiles() {
    this.loadMore = true;
    this.routeControl.setValue(this.routeControl.value);
  }

  loadImage(event, src) {
    const parent = event.target;
    const image = parent.querySelector('.fb-image-suffix-preview-image');
    if (image) {
      image.src = src;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  setFileActive(index) {
    this.activeFile$.next(index);
  }

  selectFile(file) {
    if (!this.uploadMode) {
      return;
    }

    this.dialogRef.close({
      type: 'url',
      url: file.downloadLink,
      direct: true
    });
  }
}
