import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Product} from '@shared/interfaces/product.interface';

@Component({
  selector: 'jms-w-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  constructor() { }

  @Input()
  product: Product;

  ngOnInit(): void {
  }

}
