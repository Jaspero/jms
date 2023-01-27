import {SelectionModel} from '@angular/cdk/collections';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ref, Storage, updateMetadata} from '@angular/fire/storage';
import {FormControl} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {FilterMethod, StorageItem} from '@definitions';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {disableScroll, enableScroll} from '@shared/utils/scroll';
import {BehaviorSubject, combineLatest, distinctUntilChanged, from, map, Observable, of, startWith} from 'rxjs';
import {filter, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {STORAGE_COLORS_MAP} from '../../consts/storage-colors.const';
import {StorageStateEmulator} from '../../services/storage/storage-state-emulated';
import {StorageStateRouter} from '../../services/storage/storage-state-router';
import {StorageService} from '../../services/storage/storage.service';
import {FileSelectConfiguration} from '../../types/file-select-configuration.interface';
import {StorageState} from '../../types/storage-state';
import {FolderDialogComponent} from '../folder-dialog/folder-dialog.component';
import {FullFilePreviewComponent} from '../full-file-preview/full-file-preview.component';

@UntilDestroy()
@Component({
  selector: 'jms-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageComponent implements OnInit {
  constructor(
    public storage: StorageService,
    private activatedRoute: ActivatedRoute,
    private db: DbService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private state: StateService,
    private fbStorage: Storage
  ) { }

  @Input()
  title = 'STORAGE';
  items$ = new BehaviorSubject<{
    folders: StorageItem[],
    files: StorageItem[]
  }>(null);
  routeControl: FormControl;

  @ViewChild('context')
  contextTemplate: TemplateRef<any>;

  @ViewChild('details')
  detailsTemplate: TemplateRef<any>;

  @ViewChild('share')
  shareTemplate: TemplateRef<any>;

  loading$ = new BehaviorSubject(true);
  activeElement: HTMLElement;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  writeAccess$ = new BehaviorSubject(true);
  _deletes = new Set();
  selection = new SelectionModel<StorageItem>(true);
  filesOver$: Observable<boolean>;
  filesOverNext$ = new BehaviorSubject(false);
  storageState: StorageState;
  fileSelection = new SelectionModel<StorageItem>(true);

  @Input() configuration: FileSelectConfiguration;
  @Input() dialogRef: MatDialogRef<any>;

  colorsMap = STORAGE_COLORS_MAP;

  @HostListener('document:mousedown', ['$event'])
  click(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    const isItem = (event.target as HTMLElement).closest('.storage-item');

    if (!isItem) {
      document.querySelectorAll('.storage-item.active').forEach(element =>
        element.classList.remove('active')
      );
      this.selection.clear();
    }
  }

  ngOnInit() {
    this.routeControl = new FormControl('');

    this.storageState = this.configuration ?
      new StorageStateEmulator(this.routeControl) :
      new StorageStateRouter(this.router, this.activatedRoute);

    this.activatedRoute.data
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(data => {
        const routes = (data as any)?.route || [];
        this.routeControl.setValue(routes.join('/'));
      });

    this.filesOver$ = this.filesOverNext$
      .pipe(
        distinctUntilChanged()
      );

    this.routeControl.valueChanges
      .pipe(
        startWith(this.routeControl.value),
        switchMap(route => {
          this.ngZone.run(() => {
            this.items$.next(null);
            this.loading$.next(true);
          });

          const items$ = combineLatest([
            this.getItems(route, 'public'),
            this.getItems(route, 'roles'),
            this.getItems(route, 'users'),
          ]);

          if (route && route !== '.') {
            const parentPath = route.split('/').slice(0, -1).join('/') || '.';
            const parentName = route.split('/').slice(-1)[0];

            return this.db.getValueChanges('storage', undefined, undefined, undefined, [
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
            ])
              .pipe(
                switchMap(docs => {
                  this.writeAccess$.next(docs[0] && this.storage.hasPermission(docs[0], 'write'));

                  return items$;
                })
              );
          } else {
            this.writeAccess$.next(true);
          }

          return items$;
        }),
        map(([publicItems, roleItems, userItems]) =>
          [...publicItems, ...roleItems, ...userItems].reduce((acc, item) => {
            if (item.type === 'folder') {
              if (acc.folders.every(folder => folder.id !== item.id)) {
                acc.folders.push(item);
              }
            } else {
              if (acc.files.every(file => file.id !== item.id)) {
                acc.files.push(item);
              }
            }

            return acc;
          }, {folders: [], files: []})
        ),
        distinctUntilChanged((_, current) => {

          const items = this.items$.getValue();

          if (!items) {
            return false;
          }

          const {files, folders} = items;

          const noChanges =
            current.files.length === files.length &&
            current.folders.length === folders.length &&
            !files.some(it => !current.files.some(f => f.id === it.id)) &&
            !folders.some(it => !current.folders.some(f => f.id === it.id));

          return noChanges || (
            !current.files.some(it => !this._deletes.has(it.id) && !files.some(f => f.id === it.id)) &&
            !current.folders.some(it => !this._deletes.has(it.id) && !folders.some(f => f.id === it.id))
          );
        }),
        shareReplay(1),
        tap(items => {
          this.ngZone.run(() => {
            this.loading$.next(false);
            this.items$.next(items);
            this._filterSelection();
            this.cdr.markForCheck();
          });
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  getItems(route: string, type: 'public' | 'roles' | 'users', permission?: 'read' | 'write'): Observable<StorageItem[]> {
    if (!permission) {
      return combineLatest([
        this.getItems(route, type, 'read'),
        this.getItems(route, type, 'write')
      ]).pipe(
        map(([read, write]) => [...read, ...write])
      );
    }

    // metadata.permissions_public_read = false
    // metadata.permissions_public_write = false
    // metadata.permissions_roles_admin_read = false
    // metadata.permissions_roles_admin_write = false
    // metadata.permissions_users_USERID_read = false
    // metadata.permissions_users_USERID_write = false

    const filters = [
      {
        key: 'path',
        operator: FilterMethod.Equal,
        value: route || '.'
      }
    ];

    /**
     * TODO: Also search permissions with write
     */

    switch (type) {
      case 'public': {
        filters.push({
          key: `metadata.permissions_public_${permission}`,
          operator: FilterMethod.Equal,
          value: 'true'
        });
        break;
      }
      case 'roles': {
        filters.push({
          key: `metadata.permissions_roles_${this.state.user.role}_${permission}`,
          operator: FilterMethod.Equal,
          value: 'true'
        });
        break;
      }
      case 'users': {
        filters.push({
          key: `metadata.permissions_users_${this.state.user.id}_${permission}`,
          operator: FilterMethod.Equal,
          value: 'true'
        });
        break;
      }
    }

    return this.db.getValueChanges(
      'storage',
      undefined,
      undefined,
      undefined,
      filters
    );
  }

  openItemContextMenu(event: MouseEvent, item: StorageItem, items: StorageItem[]) {
    event.preventDefault();
    event.stopPropagation();

    (event.target as HTMLDivElement).closest('mat-card').classList.add('active');

    disableScroll();

    this.dialog.open(this.contextTemplate, {
      autoFocus: false,
      width: '200px',
      position: {
        top: event.clientY + 'px',
        left: event.clientX + 'px'
      },
      backdropClass: 'clear-backdrop',
      panelClass: 'contextmenu-dialog',
      data: {
        item,
        items
      },
      scrollStrategy: new NoopScrollStrategy()
    })
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          (event.target as HTMLDivElement).closest('mat-card').classList.remove('active');
          enableScroll();
        })
      )
      .subscribe();
  }

  previewItem(item: StorageItem) {
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
    })
      .afterClosed()
      .pipe(
        take(1),
        tap(() =>
          enableScroll()
        )
      )
      .subscribe();
  }

  navigateTo(item: StorageItem | string, append = false) {
    const name = typeof item === 'string' ? item : item.name;

    const route = this.routeControl.value;
    const path = (
      (it: string) => it.startsWith('/') ? it.slice(1) : it
    )(route === '.' ? name : `${route}/${name}`).split('/').filter(it => !!it);

    const extras: NavigationExtras = {};

    if (append) {
      path.unshift('storage');
    } else {
      path.splice(0, path.length);
      path.push('storage');
      if (name) {
        path.push(name);
      }
    }

    this.storageState.navigateTo(path, extras);
  }

  mouseEnterDownload(download: StorageItem) {
    (download as any).hover = true;
    (download as any).icon = 'cancel';
    (download as any).iconColor = '#757575';
  }

  mouseLeaveDownload(download: StorageItem) {
    (download as any).hover = false;
    (download as any).icon = '';
    (download as any).iconColor = '';
  }

  trackByPath(index: number, item: StorageItem) {
    return item.path + '/' + item.name;
  }

  trackByName(index: number, item: string) {
    return item;
  }

  openFolderDialog(data?: {item: StorageItem, items: StorageItem[]}) {
    disableScroll();

    this.dialog.open(
      FolderDialogComponent,
      {
        data: {
          folder: data?.item || {},
          path: this.routeControl.value || '.',
          userId: this.state.user.id
        },
        width: '400px',
        scrollStrategy: new NoopScrollStrategy()
      }
    )
      .afterClosed()
      .subscribe(value => {
        enableScroll();

        if (!value) {
          return;
        }

        if (!value.id) {
          this.navigateTo(value.name, true);
          return;
        }

        const index = data.items.findIndex(it => it.id === value.id);
        data.items[index] = {
          ...data.items[index],
          ...value
        };

        this.items$.next({
          ...this.items$.getValue(),
          folders: [...data.items]
        });
        this.cdr.markForCheck();
      });
  }

  openUploadDialog() {
    const input: HTMLInputElement = this.renderer.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = () => {
      this.storage.uploadFiles(this.routeControl.value, input.files);

      input.remove();
    };

    input.click();
  }

  focusItem(event: MouseEvent, item: StorageItem) {
    if (event.button !== 0) {
      return;
    }

    if (!event.shiftKey) {
      document.querySelectorAll('.storage-item.active').forEach(element => {
        element.classList.remove('active');
      });

      this.selection.clear();
    }

    (event.target as HTMLElement).closest('.storage-item').classList.toggle('active');

    this.selection.toggle(item);
  }

  async openInfoDialog(item: StorageItem) {

    const parsePermission = async (key: string) => {
      if (key.startsWith('permissions_public_')) {
        return 'Public';
      }

      if (key.startsWith('permissions_users_')) {

        const userId = key.split('_')[2];

        const user = await this.db.getDocument('users', userId).toPromise();

        return user.email;
        // return 'User ' + key.split('_')[2];
      }

      if (key.startsWith('permissions_roles_')) {
        return 'Role ' + key.split('_')[2];
      }

      return 'Other';
    };

    const metadata = item.metadata || {};

    const permissions$ = from(new Promise(async (resolve) => {
      const metadataPermissions = Object.keys(metadata).filter(key => {
        return key.startsWith('permissions_');
      });

      const permissions = {read: [], write: []};

      for (const key of metadataPermissions) {
        if (metadata[key] === 'true') {
          const label = await parsePermission(key);

          if (key.endsWith('_write')) {
            permissions.write.push(label);

            permissions.read = permissions.read.filter(it => it !== label);
          } else if (key.endsWith('_read') && !permissions.write.includes(label)) {
            permissions.read.push(label);
          }
        }
      }

      resolve(permissions);
    }));

    this.dialog.open(this.detailsTemplate, {
      data: {
        item,
        permissions$
      },
      width: '500px',
      panelClass: 'full-screen-dialog'
    })
      .afterClosed()
      .pipe(
        take(1),
        tap((data) => {
          if (!data) {
            return of(false);
          }
        })
      )
      .subscribe();
  }

  async openShareDialog(item: StorageItem) {
    const typeControl = new FormControl('read');
    const inputControl = new FormControl('');
    const shares = await Promise.all(
      Object.keys(item.metadata || {}).filter(key => {
        return key.startsWith('permissions_') && item.metadata[key] === 'true';
      }).map(async (key, index, array) => {

        let label = key.split('_')[2];
        const type = key.split('_')[1];
        const permission = key.split('_').slice(-1).join('');
        const keyIdentifier = key.split('_').slice(0, -1).join('_');

        if (
          array.reduce((sum, it) => sum + (it.startsWith(keyIdentifier) ? 1 : 0), 0) > 1
          && permission === 'read'
        ) {
          return null;
        }

        if (type === 'users') {
          label = await this.db.getDocument('users', label)
            .pipe(
              take(1),
              map(user => user.email)
            )
            .toPromise();
        }

        return {
          permission: new FormControl(permission),
          label,
          type
        };
      })
    ).then(items => {
      return items.filter(it => !!it);
    });

    function select(label: string, type: string): void {
      if (!label || shares.find(it => it.label === label)) {
        return;
      }

      shares.push({
        permission: new FormControl('read'),
        label,
        type: type.toLowerCase()
      });
      inputControl.setValue('');
    }

    function remove(label: string) {
      const index = shares.findIndex(it => it.label === label);
      if (!label || index === -1) {
        return;
      }

      shares.splice(index, 1);
    }

    const autocomplete$ = this.db.getDocumentsSimple('roles').pipe(
      map(roles =>
        [
          {
            label: 'Roles',
            type: 'group',
            items: roles.map(role => {
              return {
                label: role.name,
                value: role.id
              };
            })
          },
          {
            type: 'single',
            items: ['public']
          }
        ]
      ),
      shareReplay(1)
    );

    this.dialog.open(this.shareTemplate, {
      data: {
        typeControl,
        inputControl,
        autocomplete$,
        shares,
        select,
        remove
      },
      autoFocus: false,
      width: '600px',
      maxHeight: '80vh'
    })
      .afterClosed()
      .pipe(
        take(1),
        filter(data => !!data),
        switchMap(() => {
          return from(
            Promise.all(shares.map(async (it) => {

              if (it.type === 'users') {
                const userId = await this.db.getDocuments('users', undefined, undefined, undefined, [
                  {
                    key: 'email',
                    operator: FilterMethod.Equal,
                    value: it.label
                  }
                ]).pipe(
                  take(1),
                  map(users => users[0]?.id)
                ).toPromise();

                if (!userId) {
                  return null;
                }

                it.label = userId;
              }

              return {
                permission: it.permission.value,
                label: it.label,
                type: it.type
              };
            })
            ).then(items => {
              return items.filter(it => !!it);
            })
          );
        }),
        switchMap(async items => {

          const metadata = Object.keys(item.metadata || {}).filter(key => {
            return !key.startsWith('permissions_');
          }).reduce((acc, key) => {
            acc[key] = item.metadata[key];
            return acc;
          }, {});

          for (const it of items) {
            metadata[`permissions_${it.type}_${it.label}_${it.permission}`] = 'true';
          }

          const path = item.path === '.' ? item.name : `${item.path}/${item.name}`;
          try {
            await updateMetadata(
              ref(this.fbStorage, path),
              {
                customMetadata: metadata
              }
            );
          } catch (e) {
            const itemDocument = await this.db.getDocuments(
              'storage',
              undefined,
              undefined,
              undefined,
              [
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
              ]
            )
              .pipe(
                take(1),
                map(docs => docs[0])
              )
              .toPromise();

            if (itemDocument?.id) {
              await this.db.setDocument('storage', itemDocument.id, {
                ...itemDocument.data(),
                metadata
              });
            }
          }
        })
      )
      .subscribe();
  }

  uploadFiles(route, event) {
    if (!this.writeAccess$.value) {
      return;
    }

    return this.storage.uploadFiles(route, event);
  }

  filesHovered(event: boolean | DragEvent) {
    this.filesOverNext$.next(event ? (event as DragEvent).dataTransfer?.types.includes('Files') : false);
  }

  async select() {
    if (this.fileSelection.isEmpty()) {
      return;
    }

    const urls = await Promise.all(
      this.fileSelection.selected.map(item =>
        this.storage.download(item)
      )
    );

    this.dialogRef.close({
      type: 'url',
      url: urls[0],
      name: this.fileSelection.selected[0].name,
      direct: true
    });
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  toggleSelectedFile(file: StorageItem, e: MatCheckboxChange) {
    if (this.configuration.multiple) {
      this.fileSelection.toggle(file);
      return;
    }

    this.fileSelection.clear();
    this.fileSelection[e.checked ? 'select' : 'deselect'](file);
  }

  async removeItem(data: {item: StorageItem, items: StorageItem[]}) {
    await this.storage.removeItem(data.item);

    if (this.selection.isEmpty()) {
      await this._removeItem(data);
      this._filterSelection(data.item);
      data.items = [...data.items];
    } else {
      await Promise.all(
        this.selection.selected.map(item =>
          this._removeItem({item, items: data.items})
        )
      );
      this.selection.clear();
      data.items = [...data.items];
    }

    this.cdr.markForCheck();
  }

  private async _removeItem(data: {item: StorageItem, items: StorageItem[]}) {
    await this.storage.removeItem(data.item);

    this._deletes.add(data.item.id);

    data.items.splice(
      data.items.findIndex(it => it.id === data.item.id),
      1
    );
  }

  private _filterSelection(selected?: StorageItem) {

    if (this.selection.isEmpty()) {
      return;
    }

    if (selected) {
      this.selection.deselect(selected);
      return;
    }

    const items = this.items$.getValue();

    this.selection.selected.forEach(item => {

      const key = item.type === 'folder' ? 'folders' : 'files';

      if (!items[key].some(it => it.id === item.id)) {
        this.selection.deselect(item);
      }
    })
  }
}
