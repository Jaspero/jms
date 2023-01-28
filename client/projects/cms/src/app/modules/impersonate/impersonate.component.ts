import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Auth, signInWithCustomToken} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {browserLocalPersistence, setPersistence} from '@firebase/auth';
import {from} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';

@Component({
  selector: 'jms-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export default class ImpersonateComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    const {token} = this.activatedRoute.snapshot.queryParams;

    if (!token) {
      this.router.navigate(STATIC_CONFIG.loginRoute);
    }

    from(
      setPersistence(this.auth, browserLocalPersistence)
    )
      .pipe(
        switchMap(() =>
          signInWithCustomToken(this.auth, token)
        ),
        tap(() =>
          this.router.navigate(STATIC_CONFIG.dashboardRoute)
        )
      )
      .subscribe()
  }
}
