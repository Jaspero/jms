import {CommonModule} from '@angular/common';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {InlineEditorModule} from '@jaspero/fb-page-builder';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {BlogComponent} from './blocks/blog/blog.component';
import {CallToActionComponent} from './blocks/call-to-action/call-to-action.component';
import {CommonBlockComponent} from './blocks/common.block';
import {ContactFormComponent} from './blocks/contact-form/contact-form.component';
import {ContentComponent} from './blocks/content/content.component';
import {CtaComponent} from './blocks/email/cta/cta.component';
import {ParagraphComponent} from './blocks/email/paragraph/paragraph.component';
import {MediaTextComponent} from './blocks/media-text/media-text.component';
import {NewsletterComponent} from './blocks/newsletter/newsletter.component';
import {ProductCarouselComponent} from './blocks/product-carousel/product-carousel.component';
import {ProductDetailsComponent} from './blocks/products/product-details/product-details.component';
import {ShopComponent} from './blocks/shop/shop.component';
import {BlockLinkDirective} from './directives/block-link/block-link.directive';

const B_COMPONENTS = [
  ContentComponent,
  ContactFormComponent,
  BlogComponent,
  ShopComponent,
  ProductCarouselComponent,
  MediaTextComponent,
  NewsletterComponent,
  CallToActionComponent,

  // Product
  ProductDetailsComponent,

  // Email
  ParagraphComponent,
  CtaComponent
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

    InlineEditorModule,

    SanitizeModule,
    LoadClickModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BlocksModule { }
