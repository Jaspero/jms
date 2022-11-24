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
import {DropZoneModule, SanitizeModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {FilePreviewComponent} from './components/file-preview/file-preview.component';
import {FullFilePreviewComponent} from './components/full-file-preview/full-file-preview.component';
import {StorageComponent} from './components/storage/storage.component';
import {FileIconPipe} from './pipes/file-icon/file-icon.pipe';
import {FileSizePipe} from './pipes/file-size/file-size.pipe';
import {FileUrlPipe} from './pipes/file-url/file-url.pipe';
import {FolderIconPipe} from './pipes/folder-icon/folder-icon.pipe';

@NgModule({
  declarations: [
    StorageComponent,
    FilePreviewComponent,
    FullFilePreviewComponent,
    FileIconPipe,
    FolderIconPipe,
    FileUrlPipe,
    FileSizePipe
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
    SanitizeModule,
    DragDropModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,

    TranslocoModule
  ],
  exports: [
    StorageComponent,
    FileIconPipe
  ]
})
export class StorageModule {
}
