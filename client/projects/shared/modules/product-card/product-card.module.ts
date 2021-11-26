import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ProductCardComponent} from './product-card.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    ProductCardComponent
  ],
  exports: [
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class ProductCardModule { }
