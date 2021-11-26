import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMPONENT_DATA, FieldComponent, FieldData, FormBuilderService} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {of} from 'rxjs';
import {startWith} from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'jms-product-variations',
  templateUrl: './product-variations.component.html',
  styleUrls: ['./product-variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductVariationsComponent extends FieldComponent<FieldData> implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA)
    public cData: FieldData,
    private ctx: FormBuilderService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(cData);
  }

  advanced: FormControl;
  permutations: FormGroup;
  keys: string[];

  ngOnInit() {
    this.ctx.saveComponents.push(this);

    this.advanced = new FormControl(!!Object.keys(this.cData.control.value).length);

    const variations = this.cData.form.get('variations');

    variations.valueChanges
      .pipe(
        startWith(variations.value),
        untilDestroyed(this)
      )
      .subscribe(v => {
        const price = this.cData.form.get('price').value || 0;
        const salePrice = this.cData.form.get('salePrice').value || 0;
        const sku = this.cData.form.get('sku').value;

        const permutations = v.reduce((acc, cur) => {
          if (Object.keys(acc).length && cur.options.length) {
            // tslint:disable-next-line:forin
            for (const key in acc) {
              cur.options.forEach(y => {
                acc[`${key}_${y}`] = this.fb.group({
                  price,
                  salePrice,
                  sku
                });
              });
            }
          } else {
            cur.options.forEach(x => {
              acc[x] = this.fb.group({
                price,
                salePrice,
                sku
              });
            });
          }
          return acc;
        }, {});
        const keys = Object.keys(permutations)
          .filter(key => key.split('_').length === v.length);

        if (this.permutationHash(keys) !== this.permutationHash()) {
          this.keys = keys;

          if (!this.permutations) {
            this.keys.forEach(key => {
              permutations[key].price = permutations[key].price / 100;
              permutations[key].salePrice = permutations[key].salePrice / 100;
            });
          }

          this.permutations = this.fb.group(permutations);
          this.cdr.markForCheck();
        }
      });
  }

  save() {

    if (!this.advanced.value) {
      this.cData.control.setValue({});
      return of(true);
    }

    const data = this.permutations.getRawValue();
    const attributes: {[key: string]: {
      sku?: string;
      price?: number;
      salePrice?: number;
      shipping?: number;
    }} = {};

    this.keys.forEach(key => {

      if (!attributes[key]) {
        attributes[key] = {};
      }

      attributes[key].sku = data[key].sku;
      attributes[key].price = Math.round(data[key].price * 100);
      attributes[key].salePrice = Math.round(data[key].salePrice * 100);
      attributes[key].shipping = Math.round(data[key].shipping * 100);
    });

    this.cData.control.setValue(attributes);

    return of(true);
  }

  permutationHash(keys: any = this.keys) {
    if (!keys) {
      return '';
    }

    return keys.join('--');
  }
}
