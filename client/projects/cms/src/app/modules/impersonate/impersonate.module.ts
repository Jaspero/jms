import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ImpersonateComponent} from './impersonate.component';

const routes: Routes = [{ path: '', component: ImpersonateComponent }];

@NgModule({
  declarations: [
    ImpersonateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ImpersonateModule { }
