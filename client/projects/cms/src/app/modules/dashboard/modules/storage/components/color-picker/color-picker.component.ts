import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs';
import {STORAGE_COLORS, STORAGE_COLORS_MAP} from '../../consts/storage-colors.const';

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
export class ColorPickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
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

  private sub: Subscription;

  ngOnInit() {
    this.sub = this.ctrl.valueChanges
      .subscribe(value =>
        this.onChange(value)
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
