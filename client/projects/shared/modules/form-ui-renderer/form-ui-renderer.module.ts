import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {FormUiRendererComponent} from './form-ui-renderer.component';

@NgModule({
  declarations: [FormUiRendererComponent],
  exports: [FormUiRendererComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    LoadClickModule
  ]
})
export class FormUiRendererModule { }
