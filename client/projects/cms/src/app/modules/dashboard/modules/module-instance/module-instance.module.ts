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
import {RouterModule} from '@angular/router';
import {JMSPNotesModule} from '@jaspero/jmsp-notes';
import {LoadClickModule, SanitizeModule, StopPropagationModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {ElementsModule} from '../../../../elements/elements.module';
import {EvalModule} from '../../../../shared/modules/eval/eval.module';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {SearchInputModule} from '../../../../shared/modules/search-input/search-input.module';
import {CanReadModuleGuard} from './guards/can-read-module/can-read-module.guard';
import {ConfirmExitGuard} from './guards/confirm-exit/confirm-exit.guard';
import {CustomModuleGuard} from './guards/custom-module/custom-module.guard';
import {InstanceOverviewComponent} from './pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './pages/instance-single/instance-single.component';
import {ColumnPipe} from './pipes/column/column.pipe';
import {EllipsisPipe} from './pipes/ellipsis/ellipsis.pipe';
import {OverviewResolver} from './resolvers/overview/overview.resolver';
import {DefaultOverviewService} from './services/default-overview.service';
import {DefaultSingleService} from './services/default-single.service';
import {InstanceOverviewContextService} from './services/instance-overview-context.service';

export function moduleProvider(ic: InstanceOverviewContextService) {
  return ic.module$;
}

function routes(deep = 10) {
  const paths = [];

  let base = '';

  for (let i = 0; i < deep; i++) {

    const suffix = i ? `-${i}` : '';
    const module = `${base}:module${suffix}`;
    const document = module + `/:document${suffix}`;

    paths.push(
      {
        path: module,
        canActivate: [CanReadModuleGuard],
        resolve: {
          data: OverviewResolver
        },
        component: InstanceOverviewComponent,
      },
      {
        path: document,
        canActivate: [CanReadModuleGuard],
        component: InstanceSingleComponent,
        canDeactivate: [ConfirmExitGuard]
      }
    );

    base += document + '/';
  }

  return paths;
}

@NgModule({
  declarations: [
    InstanceOverviewComponent,
    InstanceSingleComponent,

    /**
     * Pipes
     */
    EllipsisPipe,
    ColumnPipe
  ],
  providers: [
    InstanceOverviewContextService,
    CustomModuleGuard,
    CanReadModuleGuard,
    ConfirmExitGuard,

    /**
     * Provide any additional overview and single services here
     * https://github.com/Jaspero/jms/wiki/Common-Tasks#custom-services-for-modules
     */
    DefaultOverviewService,
    DefaultSingleService,

    OverviewResolver,

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
    RouterModule.forChild(routes()),
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
    EvalModule
  ]
})
export class ModuleInstanceModule { }
