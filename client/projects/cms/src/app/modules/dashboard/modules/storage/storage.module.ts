import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DropZoneModule, LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {ColorPickerComponent} from './components/color-picker/color-picker.component';
import {FilePreviewComponent} from './components/file-preview/file-preview.component';
import {FolderDialogComponent} from './components/folder-dialog/folder-dialog.component';
import {FullFilePreviewComponent} from './components/full-file-preview/full-file-preview.component';
import {IconPickerComponent} from './components/icon-picker/icon-picker.component';
import {StorageComponent} from './components/storage/storage.component';
import {FileIconPipe} from './pipes/file-icon/file-icon.pipe';
import {FileSizePipe} from './pipes/file-size/file-size.pipe';
import {FileUrlPipe} from './pipes/file-url/file-url.pipe';

@NgModule({
  declarations: [
    StorageComponent,
    FilePreviewComponent,
    FullFilePreviewComponent,
    FileIconPipe,
    FileUrlPipe,
    FileSizePipe,
    FolderDialogComponent,
    ColorPickerComponent,
    IconPickerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    /**
     * Material
     */
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    DropZoneModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DragDropModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,

    SanitizeModule,
    LoadClickModule,

    TranslocoModule
  ],
  exports: [
    StorageComponent,
    FileIconPipe
  ]
})
export class StorageModule {
}
