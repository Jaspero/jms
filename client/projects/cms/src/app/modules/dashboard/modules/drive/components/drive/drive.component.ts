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
import {BehaviorSubject, combineLatest, from, map, Observable, of, startWith} from 'rxjs';
import {DriveItem, FilterMethod} from 'definitions';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {FormControl, Validators} from '@angular/forms';
import {filter, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {disableScroll, enableScroll} from '@shared/utils/scroll';
import {FullFilePreviewComponent} from '../full-file-preview/full-file-preview.component';
import {DriveService} from '../../services/drive/drive.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {random} from '@jaspero/utils';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ref, Storage, updateMetadata} from '@angular/fire/storage';

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

  @ViewChild('details')
  detailsTemplate: TemplateRef<any>;

  @ViewChild('share')
  shareTemplate: TemplateRef<any>;

  loading$ = new BehaviorSubject(true);

  activeElement: HTMLElement;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  writeAccess$ = new BehaviorSubject(true);

  constructor(
    public drive: DriveService,
    public activatedRoute: ActivatedRoute,
    private db: DbService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private state: StateService,
    private storage: Storage
  ) {
  }

  @HostListener('document:mousedown', ['$event'])
  click(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    const isItem = (event.target as HTMLElement).closest('.drive-item');
    if (!isItem) {
      document.querySelectorAll('.drive-item.active').forEach(element => {
        element.classList.remove('active');
      });
    }
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

        const items$ = combineLatest([
          this.getItems(route, 'public'),
          this.getItems(route, 'roles'),
          this.getItems(route, 'users'),
        ]);

        if (route && route !== '.') {
          const parentPath = route.split('/').slice(0, -1).join('/') || '.';
          const parentName = route.split('/').slice(-1)[0];

          return this.db.getValueChanges('drive', undefined, undefined, undefined, [
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
          ]).pipe(
            switchMap((docs) => {

              this.writeAccess$.next(docs[0] && this.drive.hasPermission(docs[0], 'write'));

              return items$;
            })
          );
        } else {
          this.writeAccess$.next(true);
        }

        return items$;
      }),
      map(([publicItems, roleItems, userItems]) => {
        return [...publicItems, ...roleItems, ...userItems].reduce((acc, item) => {
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
        }, {folders: [], files: []});
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

  getItems(route: string, type: 'public' | 'roles' | 'users', permission?: 'read' | 'write'): Observable<DriveItem[]> {
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
      switchMap((data) => {
        enableScroll();

        if (!data) {
          return of(false);
        }

        return this.db.setDocument('drive', random.string(20), {
          name: control.value,
          path: this.routeControl.value || '.',
          type: 'folder',
          metadata: {
            ['permissions_users_' + this.state.user.id + '_write']: 'true'
          },
          contentType: 'text/plain',
          createdOn: Date.now(),
          size: 0
        }, {}).pipe(
          tap(() => {
            this.navigateTo(control.value, true);
          })
        );
      })
    ).subscribe();
  }

  openUploadDialog() {
    const input: HTMLInputElement = this.renderer.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = () => {
      this.drive.uploadFiles(this.routeControl.value, input.files);

      input.remove();
    };

    input.click();
  }

  focusItem(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    if (!event.shiftKey) {
      document.querySelectorAll('.drive-item.active').forEach(element => {
        element.classList.remove('active');
      });
    }

    (event.target as HTMLElement).closest('.drive-item').classList.toggle('active');
  }

  async openInfoDialog(item: DriveItem) {

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
      width: '256px',
      panelClass: 'full-screen-dialog'
    }).afterClosed().pipe(
      take(1),
      tap((data) => {
        if (!data) {
          return of(false);
        }
      })
    ).subscribe();
  }

  async openShareDialog(item: DriveItem) {
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
          label = await this.db.getDocument('users', label).pipe(
            take(1),
            map(user => user.email)
          ).toPromise();
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
      map((roles) => {
        return [
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
        ];
      }),
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
    }).afterClosed().pipe(
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
      switchMap(async (items) => {

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
            ref(this.storage, path),
            {
              customMetadata: metadata
            }
          );
        } catch (e) {
          const itemDocument = await this.db.getDocuments('drive', undefined, undefined, undefined, [
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
          ]).pipe(
            take(1),
            map(docs => docs[0])
          ).toPromise();

          if (itemDocument?.id) {
            await this.db.setDocument('drive', itemDocument.id, {
              ...itemDocument.data(),
              metadata
            });
          }
        }
      })
    ).subscribe();
  }

  uploadFiles(route, event) {
    if (!this.writeAccess$.value) {
      return;
    }

    return this.drive.uploadFiles(route, event);
  }
}
