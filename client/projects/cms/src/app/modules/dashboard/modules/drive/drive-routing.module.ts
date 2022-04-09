import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DriveComponent} from './components/drive/drive.component';
import {DriveModule} from './drive.module';

const routes: Routes = [
  {
    path: '',
    component: DriveComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DriveModule
  ],
  exports: [RouterModule]
})
export class DriveRoutingModule {
}
