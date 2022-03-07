import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {JMSPNotesModule} from '@jaspero/jmsp-notes';
import {LoadClickModule, SanitizeModule, StopPropagationModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {ElementsModule} from '../../../../elements/elements.module';
import {CanReadModuleGuard} from '../../../../shared/guards/can-read-module/can-read-module.guard';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {SearchInputModule} from '../../../../shared/modules/search-input/search-input.module';
import {FileManagerModule} from '../file-manager/file-manager.module';
import {ForceDisableDirective} from './directives/force-disable/force-disable.directive';
import {ConfirmExitGuard} from './guards/confirm-exit/confirm-exit.guard';
import {CustomModuleGuard} from './guards/custom-module/custom-module.guard';
import {FormSubmissionGuard} from './guards/form-submission/form-submission.guard';
import {ModuleInstanceComponent} from './module-instance.component';
import {InstanceOverviewComponent} from './pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './pages/instance-single/instance-single.component';
import {ColumnPipe} from './pipes/column/column.pipe';
import {EllipsisPipe} from './pipes/ellipsis/ellipsis.pipe';
import {InstanceOverviewContextService} from './services/instance-overview-context.service';

export function moduleProvider(ic: InstanceOverviewContextService) {
  return ic.module$;
}

const innerRoutes = {
  canActivate: [
    CanReadModuleGuard
  ],
  children: [
    {
      path: 'overview',
      component: InstanceOverviewComponent
    },
    {
      path: 'single/:id',
      component: InstanceSingleComponent,
      canDeactivate: [ConfirmExitGuard]
    },
    {
      path: '',
      redirectTo: 'overview'
    }
  ]
};

const routes: Routes = [
  {
    path: ':id',
    component: ModuleInstanceComponent,
    ...innerRoutes
  },
  {
    path: 'forms/:id/submissions',
    component: InstanceOverviewComponent,
    canActivate: [FormSubmissionGuard]
  },
  {
    path: ':collectionId/:documentId/:subCollectionId',
    component: ModuleInstanceComponent,
    ...innerRoutes
  }
];

@NgModule({
  declarations: [
    ModuleInstanceComponent,
    InstanceOverviewComponent,
    InstanceSingleComponent,

    /**
     * Pipes
     */
    EllipsisPipe,
    ColumnPipe,

    /**
     * Directives
     */
    ForceDisableDirective
  ],
  providers: [
    InstanceOverviewContextService,
    CustomModuleGuard,
    ConfirmExitGuard,
    FormSubmissionGuard,

    /**
     * We register a few general providers for
     * easier access in plugins
     */
    {
      provide: 'module',
      useFactory: moduleProvider,
      deps: [InstanceOverviewContextService]
    }
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    JMSPNotesModule,

    /**
     * Local
     */
    FormBuilderSharedModule,
    SearchInputModule,
    ElementsModule,

    /**
     * Material
     */
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    DragDropModule,
    MatCardModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    PortalModule,
    MatSortModule,
    MatCardModule,
    MatMenuModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,
    SanitizeModule,
    StopPropagationModule,

    /**
     * External
     */
    TranslocoModule,
    FileManagerModule
  ]
})
export class ModuleInstanceModule { }
