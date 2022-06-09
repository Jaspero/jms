import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvalPipe} from '../eval.pipe';



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
