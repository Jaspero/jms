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
import {SpotlightStorageResultComponent} from './spotlight-storage-result/spotlight-storage-result.component';
import {StorageModule} from '../storage/storage.module';

@NgModule({
  declarations: [SpotlightComponent, SpotlightResultComponent, SpotlightStorageResultComponent],
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
    SanitizeModule,
    StorageModule
  ]
})
export class SpotlightModule {
  constructor(
    private injector: Injector
  ) {
    [
      {
        selector: 'jms-spotlight-result',
        component: SpotlightResultComponent
      },
      {
        selector: 'jms-spotlight-storage-result',
        component: SpotlightStorageResultComponent
      }
    ].forEach(item => {
      const element = createCustomElement(item.component, {injector});
      customElements.define(item.selector, element);
    });
  }
}
