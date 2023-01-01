import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {STORAGE_COLORS, STORAGE_COLORS_MAP} from '../../consts/storage-colors.const';

@UntilDestroy()
@Component({
  selector: 'jms-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorPickerComponent
    }
  ]
})
export class ColorPickerComponent implements OnInit {
  ctrl = new FormControl('');

  touched = false;
  items = STORAGE_COLORS;
  itemMap = STORAGE_COLORS_MAP;

  onChange = (value) => { };
  onTouched = () => { };

  writeValue(value: string) {
    this.ctrl.setValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.ctrl.disable();
    } else {
      this.ctrl.enable();
    }
  }

  ngOnInit() {
    this.ctrl.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(value =>
        this.onChange(value)
      );
  }
}
