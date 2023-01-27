import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';
import {ICONS, ICONS_MAP} from '../../consts/icons.const';

@Component({
  selector: 'jms-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: IconPickerComponent
    }
  ]
})
export class IconPickerComponent implements ControlValueAccessor {
  ctrl = new FormControl('');
  filteredIcons$: Observable<any[]>;

  touched = false;
  icons = ICONS;
  itemMap = ICONS_MAP;

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
    this.filteredIcons$ = this.ctrl.valueChanges.pipe(
      startWith(''),
      map(item => (item ? this._filterIcons(item) : this.icons.slice())),
    );
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.onChange(event.option.value);
  }

  private _filterIcons(value: string) {
    const filterValue = value.toLowerCase();
    return this.icons.filter(icon => icon.name.toLowerCase().includes(filterValue));
  }
}
