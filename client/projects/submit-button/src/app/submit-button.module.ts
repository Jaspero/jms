import {DoBootstrap, Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {SubmitButtonComponent} from './submit-button.component';

@NgModule({
  declarations: [
    SubmitButtonComponent
  ],
  imports: [
    BrowserModule,
    LoadClickModule
  ],
  providers: [],
  bootstrap: [SubmitButtonComponent]
})
export class SubmitButtonModule implements DoBootstrap {
  constructor(
    private injector: Injector
  ) {}

  ngDoBootstrap() {
    const el = createCustomElement(SubmitButtonComponent, {injector: this.injector});
    customElements.define('jpe-submit-button', el);
  }
}
