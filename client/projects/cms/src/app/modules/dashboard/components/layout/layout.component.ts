import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {safeEval} from '@jaspero/form-builder';
import firebase from 'firebase/app';
import {from, Observable, throwError} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../../../environments/static-config';
import {NavigationItemType} from '../../../../shared/enums/navigation-item-type.enum';
import {NavigationItemWithActive} from '../../../../shared/interfaces/navigation-item-with-active.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '@shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../../../shared/validators/repeat-password.validator';
import {SpotlightComponent} from '../spotlight/spotlight.component';

@Component({
  selector: 'jms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  constructor(
    public state: StateService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService
  ) {}

  @ViewChild('reset')
  resetDialog: TemplateRef<any>;

  currentUser$: Observable<any>;
  links$: Observable<NavigationItemWithActive[]>;
  staticConfig = STATIC_CONFIG;
  navigationExpanded = false;

  navigationItemType = NavigationItemType;

  resetPassword: FormGroup;

  spotlightDialogRef: MatDialogRef<any>;

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

    this.currentUser$ = this.afAuth.user;

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
                !item.authorized ||
                item.authorized.includes(this.state.role)
              ) {

                if (item.function) {
                  const value = safeEval(item.value);
                  if (value) {
                    item.value = value(this.state.user, this.state.role);
                  }
                }

                acc.push({
                  ...item,
                  ...item.children ?
                    {
                      children: item.children
                        .reduce((a, c) => {
                          if (!c.authorized || c.authorized.includes(this.state.role)) {
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

              return acc;
            }, []);
          }

          return [];
        })
      );
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
    this.afAuth.signOut()
      .then(() =>
        this.router.navigate(['/login'])
      );
  }

  changePassword() {
    return () =>
      from(
        firebase.auth()
          .currentUser
          .updatePassword(this.resetPassword.get('password').value)
      )
        .pipe(
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'For security reasons please login to your account again before changing your password.';
              firebase.auth()
                .signOut()
                .then(() =>
                  this.router.navigate(['/login'])
                );
            }

            return throwError(() => ({
              error: {
                message
              }
            }));
          }),
          switchMap(() =>
            this.dbService.setDocument(
              'users',
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
