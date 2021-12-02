import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ProductDetailsComponent} from './product-details.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  exports: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class ProductDetailsModule { }
