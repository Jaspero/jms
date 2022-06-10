import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForceDisableDirective} from './force-disable.directive';


@NgModule({
  declarations: [
    ForceDisableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ForceDisableDirective
  ]
})
export class ForceDisableModule {
}
