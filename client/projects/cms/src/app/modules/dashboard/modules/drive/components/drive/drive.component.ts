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

  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
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
}
