import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Block} from '@jaspero/fb-page-builder';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface ShopOptions extends CommonOptions {
  search: boolean;
  sort: boolean;
  categories: boolean;
  tags: boolean;
}

@Block({
  label: 'SHOP',
  icon: 'article',
  previewValue: {},
  form: {
    segments: [
      {
        title: 'Sidebar Options',
        fields: [
          '/search',
          '/sort',
          '/categories',
          '/tags'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        search: {type: 'boolean', default: true},
        sort: {type: 'boolean', default: true},
        categories: {type: 'boolean', default: true},
        tags: {type: 'boolean', default: true},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      ...COMMON_OPTIONS.definitions
    }
  }
})
@Component({
  selector: 'jms-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent extends CommonBlockComponent<ShopOptions> { }
