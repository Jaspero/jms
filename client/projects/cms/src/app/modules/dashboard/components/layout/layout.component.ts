import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Auth, authState, signOut, updatePassword, User} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';
import {Collections} from '@definitions';
import {safeEval} from '@jaspero/utils';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '@shared/validators/repeat-password.validator';
import {BehaviorSubject, from, Observable, throwError} from 'rxjs';
import {catchError, filter, map, shareReplay, startWith, switchMap, take, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../../../environments/static-config';
import {NavigationItemType} from '../../../../shared/enums/navigation-item-type.enum';
import {NavigationItemWithActive} from '../../../../shared/interfaces/navigation-item-with-active.interface';
import {NavigationItem} from '../../../../shared/interfaces/navigation-item.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {SpotlightComponent} from '../../modules/spotlight/spotlight.component';

@UntilDestroy()
@Component({
  selector: 'jms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  constructor(
    public state: StateService,
    private auth: Auth,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService
  ) {
  }

  @ViewChild('reset')
  resetDialog: TemplateRef<any>;
  currentUser$: Observable<User | null>;
  links$: Observable<NavigationItemWithActive[]>;
  staticConfig = STATIC_CONFIG;
  navigationExpanded = false;
  navigationItemType = NavigationItemType;
  resetPassword: FormGroup;
  spotlightDialogRef: MatDialogRef<any>;
  activeExpand$ = new BehaviorSubject(null);

  ngOnInit() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === ' ') {
        if (this.spotlightDialogRef) {
          return;
        }

        this.spotlightDialogRef = this.dialog.open(SpotlightComponent, {
          panelClass: 'spotlight-dialog'
        });

        this.spotlightDialogRef.updatePosition({
          top: '15%'
        });

        this.spotlightDialogRef.afterClosed().pipe(
          take(1),
          tap(() => {
            this.spotlightDialogRef = null;
          })
        ).subscribe();
      }
    });

    this.currentUser$ = authState(this.auth);

    if (this.state.user.requireReset) {

      this.resetPassword = this.fb.group({
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
        {
          validator: RepeatPasswordValidator(`Passwords don't match`)
        } as AbstractControlOptions);

      setTimeout(() => {
        this.dialog.open(
          this.resetDialog,
          {
            width: '600px',
            disableClose: true
          }
        );
      }, 1000);
    }

    /**
     * There is a slight delay between when logout happens
     * and the actual redirect to the login page, because of this
     * a request is sent for fetching modules which isn't authorized
     * so we make sure to only fetch modules if the user is authenticated
     */
    this.links$ = this.currentUser$
      .pipe(
        map(user => {
          if (user) {
            return STATIC_CONFIG.navigation.items.reduce((acc, item) => {
              if (
                (
                  !item.hasPermission ||
                  this.state.permissions[item.hasPermission]?.list
                ) &&
                (
                  !item.authorized ||
                  item.authorized.includes(this.state.role)
                )
              ) {

                if (item.function) {
                  const value = safeEval(item.value);
                  if (value) {
                    item.value = value(this.state.user, this.state.role);
                  }
                }

                const children = (item.children || [])
                  .reduce((a, c) => {
                    if (
                      (!c.hasPermission || this.state.permissions[c.hasPermission]?.list) &&
                      (!c.authorized || c.authorized.includes(this.state.role))
                    ) {
                      if (c.function) {
                        const value = safeEval(c.value);
                        if (value) {
                          c.value = value(this.state.user, this.state.role);
                        }
                      }

                      a.push({
                        ...c,
                        routerOptions: {
                          exact: c.matchExact || false
                        }
                      });
                    }

                    return a;
                  }, [])

                /**
                 * Don's show items where all the children
                 * have been filtered out
                 */
                if (!item.children || children.length) {
                  acc.push({
                    ...item,
                    ...item.children ?
                      {
                        children: item.children
                          .reduce((a, c) => {
                            if (
                              (!c.hasPermission || this.state.permissions[c.hasPermission]?.list) &&
                              (!c.authorized || c.authorized.includes(this.state.role))
                            ) {
                              if (c.function) {
                                const value = safeEval(c.value);
                                if (value) {
                                  c.value = value(this.state.user, this.state.role);
                                }
                              }

                              a.push({
                                ...c,
                                routerOptions: {
                                  exact: c.matchExact || false
                                }
                              });
                            }

                            return a;
                          }, [])
                      } : {},
                    routerOptions: {
                      exact: item.matchExact || false
                    }
                  });
                }
              }

              return acc;
            }, []);
          }

          return [];
        }),
        shareReplay(1)
      );

    const expandLinks$: Observable<NavigationItem[]> = this.links$
      .pipe(
        map(links =>
          links.filter(it => it.type === NavigationItemType.Expandable)
        )
      );

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        startWith({url: location.pathname}),
        switchMap((e: NavigationEnd) =>
          expandLinks$
            .pipe(
              map(links => [e.url, links])
            )
        ),
        untilDestroyed(this)
      )
      .subscribe(([url, links]: [string, NavigationItem[]]) => {
        const exact = links.find(it => it.children.some(c => c.value === url));
        const current = this.activeExpand$.getValue();

        if (exact) {
          if (exact !== current) {
            this.activeExpand$.next(exact);
          }
          return;
        }

        const startMatch = links.find(it => it.children.some(c => url.startsWith(c.value)));

        if (startMatch) {
          if (startMatch !== current) {
            this.activeExpand$.next(startMatch);
          }
        }
      });
  }

  toggleExpand(item) {
    if (this.activeExpand$.value === item) {
      this.activeExpand$.next(null);
    } else {
      this.activeExpand$.next(item);
    }
  }

  toggleMenu() {
    this.navigationExpanded = !this.navigationExpanded;
  }

  closeMenu() {
    if (this.navigationExpanded) {
      this.navigationExpanded = false;
    }
  }

  logOut() {
    signOut(this.auth)
      .then(() =>
        this.router.navigate(STATIC_CONFIG.loginRoute)
      );
  }

  changePassword() {
    return () =>
      from(
        updatePassword(this.auth.currentUser, this.resetPassword.get('password').value)
      )
        .pipe(
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'For security reasons please login to your account again before changing your password.';
              this.logOut();
            }

            return throwError(() => ({
              error: {
                message
              }
            }));
          }),
          switchMap(() =>
            this.dbService.setDocument(
              Collections.Users,
              this.state.user.id,
              {requireReset: false},
              {merge: true}
            )
          ),
          notify({
            success: 'Your password has been updated successfully'
          }),
          tap(() => {
            this.dialog.closeAll();
          })
        );
  }
}
