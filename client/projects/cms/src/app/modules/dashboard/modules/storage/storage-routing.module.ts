import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorageComponent} from './components/storage/storage.component';
import {StorageModule} from './storage.module';
import {RouteResolver} from './resolvers/route/route.resolver';

const routes: Routes = [
  {
    path: '**',
    component: StorageComponent,
    resolve: {
      route: RouteResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StorageModule
  ],
  exports: [RouterModule]
})
export class StorageRoutingModule {
}
