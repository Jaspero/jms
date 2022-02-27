import {InstanceSort} from '../../interfaces/instance-sort.interface';
import {SortModule} from '../../interfaces/sort-module.interface';

export const ORDER = {
  property: {
    order: {
      type: 'number'
    }
  } as any,
  layout: (sortTitle = 'title') => ({
    sort: {
      active: 'order',
      direction: 'asc'
    } as InstanceSort,
    sortModule: {
      sortKey: 'order',
      sortTitle
    } as SortModule,
  })
};
