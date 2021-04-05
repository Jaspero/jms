import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {FinishSignUpComponent} from './finish-sign-up.component';

const routes: Routes = [{
  path: '',
  component: FinishSignUpComponent
}];

@NgModule({
  declarations: [FinishSignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    /**
     * Material
     */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,

    /**
     * Ng helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class FinishSignUpModule { }
