import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {QUICK_VIEW} from '@shared/blocks/injection-tokens/quick-view.injection-token';
import {Product} from '@shared/interfaces/product.interface';

@Component({
  selector: 'jms-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  constructor(
    private router: Router,
    @Optional()
    @Inject(QUICK_VIEW)
    private quickView: any
  ) { }

  @Input()
  product: Product;

  navigate(product: Product, e: MouseEvent) {
    if (this.quickView) {

      const link = '/product/' + product.id;

      if (e.ctrlKey || e.metaKey) {
        window.open(link, '_blank');
      } else {
        this.router.navigate([link]);
      }
    }
  }

  qv(product: Product) {
    if (this.quickView) {
      this.quickView(product);
    }
  }
}
