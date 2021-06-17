import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '404',
    loadChildren: () =>
      import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/page/page.module')
        .then(a => a.PageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
