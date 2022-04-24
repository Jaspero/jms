import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Color} from '../../enums/color.enum';
import {ConfirmationOptions} from './confirmation-options.interface';

@Component({
  selector: 'jms-confrimation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public inputOptions: Partial<ConfirmationOptions>
  ) {}

  defaultOptions: ConfirmationOptions = {
    header: 'ARE_YOU_SURE',
    confirm: 'REMOVE',
    negate: 'CANCEL',
    color: Color.Warn,
    variables: {}
  };

  options: ConfirmationOptions;

  ngOnInit() {
    this.options = {
      ...this.defaultOptions,
      ...(this.inputOptions || {})
    };
  }
}
