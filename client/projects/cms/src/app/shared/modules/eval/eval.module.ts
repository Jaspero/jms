import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EvalPipe} from './eval.pipe';

@NgModule({
  declarations: [
    EvalPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EvalPipe
  ]
})
export class EvalModule { }
