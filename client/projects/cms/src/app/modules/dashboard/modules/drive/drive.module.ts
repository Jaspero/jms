import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DriveComponent} from './components/drive/drive.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FileIconPipe} from './pipes/file-icon/file-icon.pipe';
import {FilePreviewComponent} from './components/file-preview/file-preview.component';
import {FileUrlPipe} from './pipes/file-url/file-url.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {DropZoneModule, SanitizeModule} from '@jaspero/ng-helpers';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FullFilePreviewComponent} from './components/full-file-preview/full-file-preview.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    DriveComponent,
    FilePreviewComponent,
    FullFilePreviewComponent,
    FileIconPipe,
    FileUrlPipe
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
    DragDropModule
  ],
  exports: [
    DriveComponent
  ]
})
export class DriveModule {
}
