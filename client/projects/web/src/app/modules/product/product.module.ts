import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductCardModule} from '@shared/modules/product-card/product-card.module';
import {ProductDetailsModule} from '../product-details/product-details.module';
import {ProductComponent} from './product.component';

const routes: Routes = [{
  path: '',
  component: ProductComponent
}];

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    ProductDetailsModule,
    ProductCardModule,
  ]
})
export class ProductModule { }
