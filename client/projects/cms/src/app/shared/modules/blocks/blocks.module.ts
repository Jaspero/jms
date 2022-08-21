import {CommonModule} from '@angular/common';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {InlineEditorModule} from '@jaspero/fb-page-builder';
import {SanitizeModule} from '@jaspero/ng-helpers';
import {CtaComponent} from './email/cta/cta.component';
import {ParagraphComponent} from './email/paragraph/paragraph.component';

const B_COMPONENTS = [
	ParagraphComponent,
	CtaComponent
];

@NgModule({
	imports: [
		CommonModule,
		InlineEditorModule,

		SanitizeModule
	],
	exports: [
		...B_COMPONENTS
	],
	declarations: [
		...B_COMPONENTS
	],
	schemas: [NO_ERRORS_SCHEMA]
})
export class BlocksModule { }
