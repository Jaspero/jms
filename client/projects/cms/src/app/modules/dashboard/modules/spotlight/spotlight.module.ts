import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SpotlightComponent} from './spotlight.component';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {TranslocoModule} from '@ngneat/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SanitizeModule} from '@jaspero/ng-helpers';
import {createCustomElement} from '@angular/elements';
import {SpotlightResultComponent} from './spotlight-result/spotlight-result.component';

@NgModule({
  declarations: [SpotlightComponent, SpotlightResultComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    /**
     * Material
     */
    MatIconModule,
    MatInputModule,
    MatListModule,

    TranslocoModule,
    SanitizeModule
  ]
})
export class SpotlightModule {
  constructor(
    private injector: Injector
  ) {
    const element = createCustomElement(SpotlightResultComponent, {injector});
    customElements.define(`jms-spotlight-result`, element);
  }
}
