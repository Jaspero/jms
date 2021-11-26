import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {InlineEditorModule} from '@jaspero/fb-page-builder';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {FormUiRendererModule} from '@shared/modules/form-ui-renderer/form-ui-renderer.module';
import {BlockRendererComponent} from './block-renderer/block-renderer.component';
import {CommonBlockComponent} from './blocks/common.block';
import {ContentComponent} from './blocks/content/content.component';
import {FormComponent} from './blocks/form/form.component';
import {BlockLinkDirective} from './directives/block-link/block-link.directive';
import {TextImageComponent} from '@shared/blocks/blocks/text-image/text-image.component';
import {HeroComponent} from '@shared/blocks/blocks/hero/hero.component';
import {MatIconModule} from '@angular/material/icon';
import {ProductListComponent} from '@shared/blocks/blocks/shop/product-list/product-list.component';
import {ProductCardModule} from '@shared/modules/product-card/product-card.module';

const B_COMPONENTS = [
  BlockRendererComponent,

  ContentComponent,
  FormComponent,
  TextImageComponent,
  HeroComponent,

  ProductListComponent,
];

@NgModule({
  declarations: [
    CommonBlockComponent,
    BlockLinkDirective,
    ...B_COMPONENTS
  ],
  exports: [
    ...B_COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    FormUiRendererModule,

    InlineEditorModule,

    SanitizeModule,
    LoadClickModule,
    MatIconModule,
    ProductCardModule
  ]
})
export class BlocksModule { }
