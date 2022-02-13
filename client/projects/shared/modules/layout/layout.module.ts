import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
