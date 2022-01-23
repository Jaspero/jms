import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import {from} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';

@Component({
  selector: 'jms-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpersonateComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
    const {token} = this.activatedRoute.snapshot.queryParams;

    if (!token) {
      this.router.navigate(STATIC_CONFIG.loginRoute);
    }

    from(
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    )
      .pipe(
        switchMap(() =>
          this.afAuth.signInWithCustomToken(token)
        ),
        tap(() =>
          this.router.navigate(STATIC_CONFIG.dashboardRoute)
        )
      )
      .subscribe()
  }
}
