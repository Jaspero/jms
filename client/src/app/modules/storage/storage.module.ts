import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule, Routes} from '@angular/router';
import {
  CUSTOM_COMPONENTS,
  DbService,
  FormBuilderContextService,
  FormBuilderModule,
  ROLE,
  STORAGE_URL,
  StorageService
} from '@jaspero/form-builder';
import {StorageComponent} from './storage.component';

const COMPONENTS = [
  StorageComponent
];

const routes: Routes = [
  {
    path: '',
    component: StorageComponent
  }
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormBuilderModule
  ],
  providers: [
    /**
     * FormBuilder
     */
    FormBuilderContextService,
    {
      provide: ROLE,
      useValue: 'admin'
    },
    {
      provide: STORAGE_URL,
      useValue: ''
    },
    {
      provide: StorageService,
      useClass: class {}
    },
    {
      provide: DbService,
      useClass: class {}
    },
    {
      provide: CUSTOM_COMPONENTS,
      useValue: {}
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ]
})
export class StorageModule { }
