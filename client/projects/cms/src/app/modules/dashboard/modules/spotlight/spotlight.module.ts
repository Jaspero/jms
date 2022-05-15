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
import {SpotlightDriveResultComponent} from './spotlight-drive-result/spotlight-drive-result.component';
import {DriveModule} from '../drive/drive.module';

@NgModule({
  declarations: [SpotlightComponent, SpotlightResultComponent, SpotlightDriveResultComponent],
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
    DriveModule
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
        selector: 'jms-spotlight-drive-result',
        component: SpotlightDriveResultComponent
      }
    ].forEach(item => {
      const element = createCustomElement(item.component, {injector});
      customElements.define(item.selector, element);
    });
  }
}
