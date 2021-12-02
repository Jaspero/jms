import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Block} from '@jaspero/fb-page-builder';
import {OnChange} from '@jaspero/ng-helpers';
import {Product} from '@shared/interfaces/product.interface';
import {snapshotsMap} from '@shared/utils/snapshots-map.operator';
import {Observable} from 'rxjs';
import {COMMON_OPTIONS} from '../../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../../common.block';

interface ProductListOptions extends CommonOptions {
  category: string;
  pageSize?: number;
  columns?: number;
}

@Block({
  id: 'product-list',
  label: 'Products',
  module: ['pages'],
  icon: 'view_module',
  previewValue: {
    category: '',
    pageSize: 9,
    columns: 4,
    ...COMMON_OPTIONS.defaults
  },
  form: {
    segments: [
      {
        fields: [
          '/category',
          '/columns',
          '/pageSize'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        category: {type: 'string'},
        columns: {type: 'string'},
        pageSize: {type: 'number'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      category: {
        label: 'Category',
        component: {
          type: 'select',
          configuration: {
            populate: {
              collection: 'shop-categories',
              orderBy: 'title',
              nameKey: 'title'
            }
          }
        }
      },
      columns: {
        label: 'Columns',
        component: {
          type: 'select',
          configuration: {
            dataSet: [
              {name: '2 Columns', value: 6},
              {name: '3 Columns', value: 4}
            ]
          }
        }
      },
      pageSize: {label: 'Max items'},
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: [
    '../../common-styles.scss',
    './product-list.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent extends CommonBlockComponent {
  constructor(
    public el: ElementRef,
    private afs: AngularFirestore
  ) {
    super(el);
  }

  products$: Observable<Product[]>;

  @OnChange(function() {
    this.products$ = this.afs
      .collection('products', ref => {
        let it = ref;

        if (this.data.category) {
          it = it.where('category', '==', this.data.category);
        }

        if (this.data.pageSize) {
          it = it.limit(this.data.pageSize);
        }

        return it.orderBy('title', 'asc');
      })
      .get()
      .pipe(snapshotsMap<Product>());
  })
  @Input()
  data: ProductListOptions;

  get size() {
    return ['c-' + this.data.columns];
  }
}
