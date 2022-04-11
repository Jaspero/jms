import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input, NgZone,
  OnInit, Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, startWith} from 'rxjs';
import {DriveItem, FilterMethod} from 'definitions';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {FormControl, Validators} from '@angular/forms';
import {shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {disableScroll, enableScroll} from '@shared/utils/scroll';
import {FullFilePreviewComponent} from '../full-file-preview/full-file-preview.component';
import {DriveService} from '../../services/drive/drive.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'jms-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriveComponent implements OnInit {

  @Input()
  title = 'Drive';
  items$ = new BehaviorSubject<{
    folders: DriveItem[],
    files: DriveItem[]
  }>(null);
  routeControl: FormControl;

  view: 'list' | 'grid' = 'grid';

  @ViewChild('context')
  contextTemplate: TemplateRef<any>;

  @ViewChild('newFolder')
  newFolderTemplate: TemplateRef<any>;

  loading$ = new BehaviorSubject(true);

  constructor(
    public drive: DriveService,
    public activatedRoute: ActivatedRoute,
    private db: DbService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.routeControl = new FormControl('');

    this.activatedRoute.data.pipe().subscribe((data) => {
      const routes = (data as any)?.route || [];
      this.routeControl.setValue(routes.join('/'));
    });

    this.routeControl.valueChanges.pipe(
      startWith(this.routeControl.value),
      switchMap((route) => {
        this.ngZone.run(() => {
          this.items$.next(null);
          this.loading$.next(true);
        });

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
      tap((items) => {
        this.ngZone.run(() => {
          this.loading$.next(false);
          this.items$.next(items);
          this.cdr.markForCheck();
        });
      }),
      untilDestroyed(this)
    ).subscribe();
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

  previewItem(item: DriveItem) {
    disableScroll();

    this.dialog.open(FullFilePreviewComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-dialog',
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

  navigateTo(item: DriveItem | string, append = false) {
    const name = typeof item === 'string' ? item : item.name;

    const route = this.routeControl.value;
    const path = (
      (it: string) => it.startsWith('/') ? it.slice(1) : it
    )(route === '.' ? name : `${route}/${name}`).split('/').filter(it => !!it);

    const extras: NavigationExtras = {};

    if (append) {
      path.unshift('drive');
    } else {
      path.splice(0, path.length);
      path.push('drive');
      if (name) {
        path.push(name);
      }
    }

    this.router.navigate(path, extras);
  }

  mouseEnterDownload(download: DriveItem) {
    (download as any).hover = true;
    (download as any).icon = 'cancel';
    (download as any).iconColor = '#757575';
  }

  mouseLeaveDownload(download: DriveItem) {
    (download as any).hover = false;
    (download as any).icon = '';
    (download as any).iconColor = '';
  }

  trackByPath(index: number, item: DriveItem) {
    return item.path + '/' + item.name;
  }

  trackByName(index: number, item: string) {
    return item;
  }

  openNewFolderDialog() {
    const control = new FormControl('', [Validators.required]);

    disableScroll();
    this.dialog.open(this.newFolderTemplate, {
      data: {
        control
      },
      width: '400px',
      scrollStrategy: new NoopScrollStrategy()
    }).afterClosed().pipe(
      take(1),
      tap((data) => {
        enableScroll();

        if (!data) {
          return;
        }

        this.navigateTo(control.value, true);
      })
    ).subscribe();
  }

  openUploadDialog() {
    const input: HTMLInputElement = this.renderer.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = (event) => {
      console.log('CHANGE');
      console.log(input.files);
      console.log(event);

      this.drive.uploadFiles(this.routeControl.value, input.files);

      input.remove();
    };

    input.click();
  }
}
