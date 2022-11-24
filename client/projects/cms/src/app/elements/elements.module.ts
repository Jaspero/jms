import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {LoadClickModule, SanitizeModule, StopPropagationModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {STATIC_CONFIG} from '../../environments/static-config';
import {StorageModule} from '../modules/dashboard/modules/storage/storage.module';
import {EvalModule} from '../shared/modules/eval/eval.module';
import {FormBuilderSharedModule} from '../shared/modules/fb/form-builder-shared.module';
import {SearchInputModule} from '../shared/modules/search-input/search-input.module';
import {StateService} from '../shared/services/state/state.service';
import {ChangeEmailComponent} from './change-email/change-email.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ColumnOrganizationComponent} from './column-organization/column-organization.component';
import {ELEMENTS} from './element.decorator';
import {ExportComponent} from './export/export.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {FilterTagsComponent} from './filter-tags/filter-tags.component';
import {ImpersonateComponent} from './impersonate/impersonate.component';
import {ImportComponent} from './import/import.component';
import {LinkComponent} from './link/link.component';
import {NewPrepopulateComponent} from './new-prepopulate/new-prepopulate.component';
import {ParseTemplatePipe} from './pipes/parse-template/parse-template.pipe';
import {SampleEmailComponent} from './sample-email/sample-email.component';
import {SortDialogComponent} from './sort-dialog/sort-dialog.component';
import {StorageSelectComponent} from './storage-select/storage-select.component';
import {TableComponent} from './table/table.component';
import {TriggerPasswordResetComponent} from './trigger-password-reset/trigger-password-reset.component';
import {UserActionsComponent} from './user-actions/user-actions.component';
import {UserAddComponent} from './user-add/user-add.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    /**
     * Anything the elements use
     * needs to be imported here
     */
    StorageModule,

    FormBuilderSharedModule,

    TranslocoModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatListModule,
    PortalModule,
    MatSlideToggleModule,
    MatExpansionModule,
    DragDropModule,

    LoadClickModule,
    StopPropagationModule,
    SanitizeModule,
    SearchInputModule,
    EvalModule
  ],
  exports: [],
  declarations: [
    /**
     * Element Dependencies
     */
    ColumnOrganizationComponent,
    ImportComponent,
    ExportComponent,
    SortDialogComponent,
    FilterTagsComponent,
    FilterDialogComponent,

    ParseTemplatePipe,

    /**
     * Elements
     */
    LinkComponent,
    TableComponent,
    TriggerPasswordResetComponent,
    UserAddComponent,
    ChangePasswordComponent,
    UserActionsComponent,
    ChangeEmailComponent,
    NewPrepopulateComponent,
    ImpersonateComponent,
    SampleEmailComponent,
    StorageSelectComponent
  ],
  providers: [
    {
      provide: 'elementsPrefix',
      useValue: STATIC_CONFIG.elements.selectorPrefix
    }
  ]
})
export class ElementsModule {
  constructor(
    private injector: Injector,
    private state: StateService
  ) {
    /**
     * Register custom elements
     */
    if (!this.state.elementsRegistered) {
      for (const selector of Object.keys(ELEMENTS)) {
        const component = ELEMENTS[selector];

        const element = createCustomElement(component, {injector});
        customElements.define(selector, element);
      }

      this.state.elementsRegistered = true;
    }
  }
}
