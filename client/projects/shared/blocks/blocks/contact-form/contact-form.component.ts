import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface FormOptions extends CommonOptions {}

@Block({
  label: 'CONTACT_FORM',
  icon: 'view_agenda',
  module: ['pages', 'posts'],
  previewValue: {
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent extends CommonBlockComponent<FormOptions> {}
