import {NgModule} from '@angular/core';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RouterModule, Routes} from '@angular/router';
import {STATIC_CONFIG} from '../environments/static-config';
import {HasClaimGuard} from './shared/guards/has-claim/has-claim.guard';
import {RedirectGuard} from './shared/guards/redirect/redirect.guard';

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
    loadChildren: () =>
      import('./modules/login/login.module')
        .then(m => m.LoginModule),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'finish-sign-up',
    loadChildren: () =>
      import('./modules/finish-sign-up/finish-sign-up.module')
        .then(m => m.FinishSignUpModule),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'trigger-password-reset',
    loadChildren: () =>
      import('./modules/trigger-password-reset/trigger-password-reset.module')
        .then(m => m.TriggerPasswordResetModule),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./modules/reset-password/reset-password.module')
        .then(m => m.ResetPasswordModule)
  },
  {
    path: 'mfa',
    loadChildren: () =>
      import('./modules/mfa/mfa.module')
        .then(m => m.MfaModule)
  },
  {
    path: 'impersonate',
    loadChildren: () =>
      import('./modules/impersonate/impersonate.module')
        .then(m => m.ImpersonateModule)
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
  exports: [RouterModule]
})
export class AppRoutingModule {}
