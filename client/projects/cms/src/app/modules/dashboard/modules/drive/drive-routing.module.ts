import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DriveComponent} from './components/drive/drive.component';
import {DriveModule} from './drive.module';
import {RouteResolver} from './resolvers/route/route.resolver';

const routes: Routes = [
  {
    path: '**',
    component: DriveComponent,
    resolve: {
      route: RouteResolver
    }
  }
  // {
  //   path: '',
  //   component: DriveComponent,
  //   children: [
  //     {
  //       path: ':id',
  //       loadChildren: () => import('./drive-routing.module').then(m => m.DriveRoutingModule)
  //     }
  //   ]
  // },
  // {
  //   path: ':route',
  //   component: DriveComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./drive-routing.module').then(m => m.DriveRoutingModule)
  //     }
  //   ]
  //   // children: [
  //   //   {
  //   //     path: '**',
  //   //     component: DriveComponent
  //   //   }
  //   // ]
  // }
];
//
// { path: '', component: FolderComponent, children: [
//   { path: ':id', loadChildren: './src/folder/folder.module' }
// ]},

// routes[1].children = routes;

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DriveModule
  ],
  exports: [RouterModule]
})
export class DriveRoutingModule {
}
