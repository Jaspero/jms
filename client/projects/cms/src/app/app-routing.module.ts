import {NgModule} from '@angular/core';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {STATIC_CONFIG} from '../environments/static-config';
import {HasCodeGuard} from './modules/reset-password/guards/has-code/has-code.guard';
import {HasClaimGuard} from './shared/guards/has-claim/has-claim.guard';
import {RedirectGuard} from './shared/guards/redirect/redirect.guard';
import {AppReuseStrategy} from './shared/utils/app-reuse.strategy';

const redirectUnauthorized = () => redirectUnauthorizedTo(STATIC_CONFIG.loginRoute);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(STATIC_CONFIG.dashboardRoute);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [
      RedirectGuard,
      AuthGuard,
      HasClaimGuard
    ],
    data: {
      authGuardPipe: redirectUnauthorized
    }
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/login/login.component'),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'finish-sign-up',
    loadComponent: () =>
      import('./modules/finish-sign-up/finish-sign-up.component'),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'trigger-password-reset',
    loadComponent: () =>
      import('./modules/trigger-password-reset/trigger-password-reset.component'),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'reset-password',
    providers: [HasCodeGuard],
    canActivate: [HasCodeGuard],
    loadComponent: () =>
      import('./modules/reset-password/reset-password.component')
  },
  {
    path: 'mfa',
    loadComponent: () =>
      import('./modules/mfa/authentication.component')
  },
  {
    path: 'impersonate',
    loadComponent: () =>
      import('./modules/impersonate/impersonate.component')
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: AppReuseStrategy
    }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
