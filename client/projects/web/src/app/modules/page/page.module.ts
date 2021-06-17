import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlocksModule} from '@shared/blocks/blocks.module';
import {PageComponent} from './page.component';
import {PageResolver} from './page.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: PageComponent,
    resolve: {
      page: PageResolver
    },
    data: {
      collection: 'pages'
    }
  }
];

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BlocksModule
  ],
  providers: [
    PageResolver
  ]
})
export class PageModule { }
