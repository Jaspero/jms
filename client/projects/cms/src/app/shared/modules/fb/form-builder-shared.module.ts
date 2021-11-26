import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FbFieldsMatModule} from '@jaspero/fb-fields-mat';
import {FbSegmentsMatModule} from '@jaspero/fb-segments-mat';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormUiModule} from '@jaspero/fb-form-ui';
import {MonacoEditorModule} from '@jaspero/fb-monaco-editor';
import {FB_PAGE_BUILDER_OPTIONS, PageBuilderModule} from '@jaspero/fb-page-builder';
import {TemplateEditorModule, TinymceModule} from '@jaspero/fb-tinymce';
import {
  CUSTOM_COMPONENTS, CUSTOM_FIELDS,
  DbService as FDbService,
  FormBuilderModule,
  ROLE,
  STORAGE_URL,
  StorageService
} from '@jaspero/form-builder';
import {TranslocoModule} from '@ngneat/transloco';
import {BlocksModule} from '@shared/blocks/blocks.module';
import {environment} from '../../../../environments/environment';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';
import {DuplicateComponent} from './custom-components/duplicate/duplicate.component';
import {EmailTemplateDescriptionComponent} from './custom-components/email-template-description/email-template-description.component';
import {ProductVariationsComponent} from './custom-fields/product-variations/product-variations.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
export function roleFactory(state: StateService) {
  return state.role;
}

@NgModule({
  imports: [
    CommonModule,

    /**
     * Schema Forms
     */
    FormBuilderModule.forRoot(),
    FbFieldsMatModule.forRoot({prefix: ''}),
    FbSegmentsMatModule.forRoot({prefix: ''}),
    TinymceModule,
    PageBuilderModule,
    TemplateEditorModule,
    FormUiModule,
    MonacoEditorModule,

    /**
     * Custom fields and component dependencies
     */
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,

    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [
    FormBuilderModule
  ],
  providers: [
    {
      provide: StorageService,
      useExisting: AngularFireStorage
    },
    {
      provide: FDbService,
      useExisting: DbService
    },
    {
      provide: ROLE,
      useFactory: roleFactory,
      deps: [StateService]
    },
    {
      provide: STORAGE_URL,
      useValue: 'https://firebasestorage.googleapis.com/v0/b/' + environment.firebase.storageBucket
    },
    {
      provide: CUSTOM_COMPONENTS,
      useValue: {
        duplicate: DuplicateComponent,
        'email-template-description': EmailTemplateDescriptionComponent
      }
    },
    {
      provide: CUSTOM_FIELDS,
      useValue: {
        'product-variations': ProductVariationsComponent
      }
    },
    {
      provide: FB_PAGE_BUILDER_OPTIONS,
      useValue: {
        previewModules: [BlocksModule]
      }
    },
  ],
  declarations: [
    DuplicateComponent,
    EmailTemplateDescriptionComponent,
    ProductVariationsComponent,
  ]
})
export class FormBuilderSharedModule {}
