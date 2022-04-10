import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, shareReplay, startWith} from 'rxjs';
import {DriveItem, FilterMethod} from 'definitions';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {FormControl} from '@angular/forms';
import {debounceTime, switchMap, take, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {disableScroll, enableScroll} from '@shared/utils/scroll';
import {FullFilePreviewComponent} from '../full-file-preview/full-file-preview.component';
import {getStorage, ref} from '@angular/fire/storage';
import {FbStorageService} from '../../../../../../../../integrations/firebase/fb-storage.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {random} from '@jaspero/utils';

@Component({
  selector: 'jms-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriveComponent implements OnInit {

  @Input()
  title = 'Drive';
  items$: Observable<{
    folders: DriveItem[],
    files: DriveItem[]
  }>;
  routeControl: FormControl;

  view: 'list' | 'grid' = 'grid';

  @ViewChild('context')
  contextTemplate: TemplateRef<any>;

  loading$ = new BehaviorSubject(true);

  downloads$ = new BehaviorSubject([]);

  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private storage: FbStorageService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.routeControl = new FormControl('');

    this.items$ = this.routeControl.valueChanges.pipe(
      debounceTime(500),
      startWith(this.routeControl.value),
      switchMap((route) => {
        this.loading$.next(true);

        return combineLatest([
          this.getItems(route, 'folder'),
          this.getItems(route, 'file')
        ]);
      }),
      map(([folders, files]) => {
        return {
          folders,
          files
        };
      }),
      shareReplay(1),
      tap((a) => {
        this.loading$.next(false);
        this.cdr.markForCheck();
      })
    );
  }

  getItems(route: string, type?: 'file' | 'folder'): Observable<DriveItem[]> {

    const filters = [
      {
        key: 'path',
        operator: FilterMethod.Equal,
        value: route || '.'
      }
    ];

    if (type) {
      filters.push({
        key: 'type',
        operator: FilterMethod.Equal,
        value: type
      });
    }

    return this.db.getValueChanges(
      'drive',
      undefined,
      undefined,
      undefined,
      filters
    );
  }

  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
  }

  openItemContextMenu(event: MouseEvent, item: DriveItem) {
    event.preventDefault();
    event.stopPropagation();

    (event.target as HTMLDivElement).closest('.mat-card').classList.add('active');
    disableScroll();

    this.dialog.open(this.contextTemplate, {
      autoFocus: false,
      width: '140px',
      position: {
        top: event.clientY + 'px',
        left: event.clientX + 'px'
      },
      backdropClass: 'clear-backdrop',
      panelClass: 'contextmenu-dialog',
      data: {
        item
      },
      scrollStrategy: new NoopScrollStrategy()
    }).afterClosed().pipe(
      take(1),
      tap(() => {
        (event.target as HTMLDivElement).closest('.mat-card').classList.remove('active');
        enableScroll();
      })
    ).subscribe();
  }

  downloadItem(item: DriveItem) {
    console.log('download', item);

    if (item.type === 'folder') {
      return console.log('Cannot download folder');
    }


    const storageInstance = getStorage();
    const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;

    // getBlob(ref(storageInstance, path)).then(a => {
    //   console.log(a);
    // });

    this.storage.getDownloadURL(ref(storageInstance, path)).then(async (url) => {

      // url = ;
      // if (item.contentType.startsWith('image/') || item.contentType.startsWith('video/')) {
      //
      // }

      // saveAs(url, item.name);
      // // const link = document.createElement('a');
      // // link.href = url;
      // // link.target = '_blank';
      // // link.setAttribute('download', item.name);
      // // document.body.appendChild(link);
      // // link.click();
      // // document.body.removeChild(link);
      //
      //
      // //
      // // const link = document.createElement('a');
      // // link.href = url;
      // // link.setAttribute('download', item.name);
      // // document.body.appendChild(link);
      // // link.click();
      // // document.body.removeChild(link);

      const id = random.string(8);

      this.downloads$.next([...this.downloads$.value, {
        name: item.name,
        url,
        percent: 0,
        id
      }]);

      this.http.get(
        this.db.url('cms-proxy/' + url),
        {
          responseType: 'blob',
          reportProgress: true,
          observe: 'events'
        }
      ).pipe(
        tap((result) => {
          if (result.type === HttpEventType.DownloadProgress) {
            const percent = Math.round(100 * result.loaded / result.total);
            console.log(percent);

            this.downloads$.next(this.downloads$.value.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  percent
                };
              }

              return item;
            }));
          }
          if (result.type === HttpEventType.Response) {
            // this.generateDownload(result.body);
            console.log('FINISHED');
            saveAs(result.body, item.name);
            console.log(result.body);
          }
        })
      ).subscribe();
    });
  }

  previewItem(item: DriveItem) {
    console.log('preview', item);

    disableScroll();

    this.dialog.open(FullFilePreviewComponent, {

      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-dialog',

      // autoFocus: false,
      // width: '100%',
      // height: '100%',
      // // width: '140px',
      // backdropClass: 'clear-backdrop',
      // panelClass: 'contextmenu-dialog',
      data: {
        item
      },
      scrollStrategy: new NoopScrollStrategy()
    }).afterClosed().pipe(
      take(1),
      tap(() => {
        enableScroll();
      })
    ).subscribe();
  }

  uploadItems(files: FileList) {
    console.log(files);
  }

  closeDownloads() {
    this.downloads$.next([]);
  }
}
