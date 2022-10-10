import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {FbFieldsMatModule} from '@jaspero/fb-fields-mat';
import {FB_PAGE_BUILDER_OPTIONS, PageBuilderModule} from '@jaspero/fb-page-builder';
import {FbSegmentsMatModule} from '@jaspero/fb-segments-mat';
import {TinymceModule} from '@jaspero/fb-tinymce';
import {
  CUSTOM_COMPONENTS, CUSTOM_FIELDS,
  DbService as FDbService,
  FormBuilderModule,
  ROLE, StorageService, STORAGE_URL
} from '@jaspero/form-builder';
import {TranslocoModule} from '@ngneat/transloco';
import {FbStorageService} from '../../../../../integrations/firebase/fb-storage.service';
import {environment} from '../../../../environments/environment';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';
import {BlocksModule} from '../blocks/blocks.module';
import {DuplicateComponent} from './custom-components/duplicate/duplicate.component';
import {EmailTemplateDescriptionComponent} from './custom-components/email-template-description/email-template-description.component';
import {PermissionsComponent} from './custom-fields/permissions/permissions.component';

export function roleFactory(state: StateService) {
  return state.role;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormBuilderModule.forRoot(),
    FbFieldsMatModule.forRoot({prefix: ''}),
    FbSegmentsMatModule.forRoot({prefix: ''}),
    TinymceModule,
    PageBuilderModule,

    /**
     * Custom fields and component dependencies
     */
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,

    TranslocoModule
  ],
  exports: [
    FormBuilderModule
  ],
  providers: [
    {
      provide: StorageService,
      useExisting: FbStorageService
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
        permissions: PermissionsComponent
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

    /**
     * Custom Components
     */
    DuplicateComponent,
    EmailTemplateDescriptionComponent,

    /**
     * Custom Fields
     */
    PermissionsComponent
  ]
})
export class FormBuilderSharedModule { }
