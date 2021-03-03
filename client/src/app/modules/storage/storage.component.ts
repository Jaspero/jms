import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import firebase from 'firebase/app';
import 'firebase/storage';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {Color} from '../../shared/enums/color.enum';
import {confirmation} from '../../shared/utils/confirmation';

@Component({
  selector: 'jms-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) {
  }

  title = 'GENERAL.TITLE : {value: 123}';

  routeControl: FormControl;
  displayMode$ = new BehaviorSubject<'list' | 'grid'>('list');
  data$: Observable<{
    files: any[];
    folders: any[];
  }>;
  loading$ = new BehaviorSubject(false);

  @ViewChild('metadata')
  metadataDialogElement: TemplateRef<any>;
  metadataDialog: MatDialogRef<any>;

  ngOnInit(): void {
    this.routeControl = new FormControl('/', {
      updateOn: 'blur'
    });

    this.data$ = this.routeControl.valueChanges.pipe(
      startWith(this.routeControl.value),
      switchMap(route => {
        this.loading$.next(true);
        const ref = firebase.storage().ref();

        return ref.child(route).list({
          maxResults: 10
        });
      }),
      switchMap(response => {
        return Promise.all([
          Promise.all(
            response.items.map(async (item) => {
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
      tap((data) => {
        console.log({data});
        this.loading$.next(false);
      })
    );
  }

  toggleDisplayMode() {
    const current = this.displayMode$.value;
    this.displayMode$.next(current === 'list' ? 'grid' : 'list');
  }

  typeToIcon(type = '') {
    if (type.startsWith('image/')) {
      return 'insert_photo';
    }

    if (type === 'application/pdf') {
      return 'picture_as_pdf';
    }

    if (type === 'application/zip') {
      return 'compress';
    }

    if (type.startsWith('text/')) {
      return 'article';
    }

    return 'note';
  }

  navigateBack() {
    const route = this.routeControl.value.split('/').filter(it => it);
    route.pop();

    this.routeControl.setValue('/' + route.join('/'));
  }

  appendFolder(folder: string) {
    let route: string = this.routeControl.value;
    if (!route.endsWith('/')) {
      route += '/';
    }
    route += folder;

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
      switchMap(() => {
        return firebase.storage().ref(file.fullPath).delete();
      }),
      tap(() => {
        this.routeControl.setValue(this.routeControl.value);
      })
    ], {
      description: 'STORAGE.DELETE_FILE.DESCRIPTION',
      confirm: 'STORAGE.DELETE_FILE.CONFIRM',
      color: Color.Warn,
      variables: {
        name: file.name
      }
    });
  }

  editFileMetadata(file) {
    const keys = Object.keys(file.customMetadata);
    this.metadataDialog = this.dialog.open(this.metadataDialogElement, {
      autoFocus: false,
      data: {
        ...file,
        fb: {
          schema: {
            properties: keys.reduce((acc, key) => {
              acc[key] = { type: 'string' };
              return acc;
            }, {})
          },
          value: file.customMetadata || {a: '123'}
        }
      },
      width: '600px'
    });
  }
}
