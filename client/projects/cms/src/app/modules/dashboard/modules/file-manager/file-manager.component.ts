import {Clipboard} from '@angular/cdk/clipboard';
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
import {safeEval} from '@jaspero/utils';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {BehaviorSubject, combineLatest, Observable, of, Subscription, throwError} from 'rxjs';
import {map, scan, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {Color} from '../../../../shared/enums/color.enum';
import {confirmation} from '../../../../shared/utils/confirmation';
import {FileManagerService} from './file-manager.service';

@UntilDestroy()
@Component({
  selector: 'jms-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerComponent implements OnInit, OnDestroy {
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
  configuration = {
    uploadMode: false,
    allowUpload: true,
    route: '/',
    hidePath: false,
    filters: []
  };
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

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private clipboard: Clipboard,
    private fileManager: FileManagerService
  ) {
  }

  ngOnInit() {
    this.routeControl = new FormControl(this.configuration.route, {
      updateOn: 'blur'
    });

    this.data$ = this.routeControl.valueChanges.pipe(
      startWith(this.routeControl.value),
      switchMap(route => {
        this.loading$.next(true);
        this.activeFile$.next(-1);
        return this.fileManager.list(route, this.nextPageToken);
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
          ).then(files => {
            return files.filter(file => {
              return this.configuration.filters.every(filter => {
                try {
                  const fn = safeEval(filter.value);

                  return fn(file);
                } catch (error) {
                }
              });
            });
          }),
          Promise.all(
            response.prefixes.map(async (item) => {
              return {
                name: item.name,
                type: 'folder',
                icon: 'folder',
                fullPath: item.fullPath
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
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

  deleteFolder(folder) {
    confirmation([
      switchMap(() => this.fileManager.deleteFolder(folder.fullPath)
        .pipe(notify())),
      tap(() => this.reset())
    ], {
      description: 'FILE_MANAGER.DELETE_FOLDER.DESCRIPTION',
      confirm: 'FILE_MANAGER.DELETE_FOLDER.CONFIRM',
      color: Color.Warn,
      variables: {
        name: folder.name
      }
    });
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

  copyURL(file) {
    return () => {
      return of(this.clipboard.copy(file.downloadLink) || throwError(''))
        .pipe(
          notify({
            success: 'FILE_MANAGER.COPY.SUCCESS',
            error: 'FILE_MANAGER.COPY.ERROR'
          })
        );
    };
  }

  deleteFile(file) {
    confirmation([
      switchMap(() => this.fileManager.deleteFile(file.fullPath)),
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
    ])
      .pipe(
        map(([data, route]) =>
          data.folders.filter(folder =>
            folder.name.toLowerCase().replace(/\//g, '').indexOf((route || '').replace(/\//g, '').toLowerCase()) > -1
          )
            .map(folder => '/' + folder.name)
        )
      );

    this.uploadDialog = this.dialog.open(this.uploadDialogElement, {
      autoFocus: false,
      width: '600px',
      data: {form}
    });

    this.subscriptions.push(
      this.uploadDialog.afterClosed().pipe(
        tap(() => {
          this.uploadProgress$.next(0);
          const uploadTask = form.get('uploadTask').value;

          if (uploadTask) {
            uploadTask.forEach(it => it.cancel());
          }
        })
      ).subscribe()
    );
  }

  openFileUpload() {
    this.fileElement.nativeElement.click();
  }

  fileChange(form: FormGroup) {
    const el = this.fileElement.nativeElement as HTMLInputElement;
    const files = el.files as FileList;
    const {length} = files;
    form.get('file').setValue(
      length ?
        length > 1 ?
          `Selected ${length} files.` :
          Array.from(files)[0].name :
        ''
    );
  }

  async startUpload(form: FormGroup) {
    const el = this.fileElement.nativeElement as HTMLInputElement;
    const files = Array.from(el.files as FileList) as File[];
    const uploads = [];

    form.get('uploadTask').setValue([]);

    let route = form.get('route').value;

    if (!route.endsWith('/')) {
      route += '/';
    }

    for (const file of files) {
      Object.defineProperty(file, 'name', {
        writable: true,
        value: formatFileName(file.name)
      });

      uploads.push(await this.fileManager.upload(route, file));
    }

    combineLatest(uploads.map(it => it.progress))
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((statuses: Array<{complete?: boolean, status: string, progress: number}>) => {
        if (!statuses.some(it => !it.complete)) {
          this.uploadProgress$.next(0);
          el.value = '';
          this.uploadDialog.close();
          this.reset();

          return;
        }

        const progress = statuses.reduce((acc, cur) =>
          acc + (cur.complete ? 100 : cur.progress), 0) / files.length;

        this.uploadProgress$.next(Number(progress.toFixed(2)));
      });

    form.get('uploadTask').setValue(uploads.map(it => it.uploadTask));
  }

  cancelDownload(form: FormGroup) {
    form.get('paused').setValue(false);
    form.get('uploadTask').value.forEach(it => it.cancel());
    this.uploadDialog.close();
  }

  pauseDownload(form: FormGroup) {
    form.get('paused').setValue(true);
    form.get('uploadTask').value.forEach(it => it.pause());
  }

  resumeDownload(form: FormGroup) {
    form.get('paused').setValue(false);
    form.get('uploadTask').value.forEach(it => it.resume());
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

  setFileActive(index) {
    this.activeFile$.next(index);
  }

  selectFile(file) {
    if (!this.configuration.uploadMode) {
      return;
    }

    this.dialogRef.close({
      type: 'url',
      url: file.downloadLink,
      name: file.name,
      direct: true
    });
  }
}
