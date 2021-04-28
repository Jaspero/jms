import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule, Routes} from '@angular/router';
import {FormBuilderModule} from '@jaspero/form-builder';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {FileSizePipe} from '../../../../shared/pipes/file-size/file-size.pipe';
import {FileManagerComponent} from './file-manager.component';

const routes: Routes = [
  {
    path: '',
    component: FileManagerComponent
  }
];

@NgModule({
  declarations: [
    FileManagerComponent,
    FileSizePipe
  ],
  imports: [
    /**
     * Angular
     */
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    /**
     * Material
     */
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule,
    MatAutocompleteModule,

    /**
     * External
     */
    FormBuilderSharedModule,
    FormBuilderModule,
    LoadClickModule,
    TranslocoModule
  ]
})
export class FileManagerModule { }
