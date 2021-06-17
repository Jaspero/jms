import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormUiModule} from '@jaspero/fb-form-ui';
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
    TinymceModule,
    PageBuilderModule,
    TemplateEditorModule,
    FormUiModule,

    /**
     * Custom fields and component dependencies
     */
    MatButtonModule,
    MatIconModule,
    TranslocoModule
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
        duplicate: DuplicateComponent
      }
    },
    {
      provide: CUSTOM_FIELDS,
      useValue: {}
    },
    {
      provide: FB_PAGE_BUILDER_OPTIONS,
      useValue: {
        previewModules: [BlocksModule]
      }
    },
  ],
  declarations: [DuplicateComponent]
})
export class FormBuilderSharedModule {}
