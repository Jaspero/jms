import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {DbService} from '../../shared/services/db/db.service';
import {StateService} from '../../shared/services/state/state.service';
import {ActiveLinkDirective} from './components/active-link/active-link.directive';
import {LayoutComponent} from './components/layout/layout.component';
import {SpotlightModule} from './modules/spotlight/spotlight.module';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'dashboard',
      loadComponent: () =>
        import ('./modules/overview/overview.component')
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('./modules/profile/profile.module')
          .then(m => m.ProfileModule)
    },
    {
      path: 'm',
      loadChildren: () =>
        import('./modules/module-instance/module-instance.module')
          .then(m => m.ModuleInstanceModule)
    },
    {
      path: 'storage',
      loadChildren: () => import('./modules/storage/storage-routing.module')
        .then(m => m.StorageRoutingModule)
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    }
  ]
}];

const COMPONENTS = [
  LayoutComponent
];

const DIRECTIVES = [
  ActiveLinkDirective
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    SpotlightModule,

    /**
     * Material
     */
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,

    /**
     * Ng helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ],
  providers: [
    /**
     * We provide it with a string reference here
     * so that it can be used in plugins
     */
    {
      provide: 'stateService',
      useExisting: StateService
    },
    {
      provide: 'dbService',
      useExisting: DbService
    }
  ]
})
export class DashboardModule {
}
