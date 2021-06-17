import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BlockRendererComponent} from '@shared/blocks/block-renderer/block-renderer.component';
import {CommonBlockComponent} from '@shared/blocks/blocks/common.block';
import {ContentComponent} from '@shared/blocks/blocks/content/content.component';
import {BlockLinkDirective} from '@shared/blocks/directives/block-link/block-link.directive';

export const BLOCKS = {
  content: ContentComponent,
};

const B_COMPONENTS = [
  BlockRendererComponent,

  ContentComponent
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
    RouterModule
  ]
})
export class BlocksModule { }
