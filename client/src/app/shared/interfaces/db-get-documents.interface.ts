import {WhereFilter} from './where-filter.interface';

export interface DbGetDocuments {
  moduleId: string;
  pageSize?: number;
  sort?: {
    active: string;
    direction: 'desc' | 'asc';
  };
  cursor?: any;
  filters?: WhereFilter[];
  source?: 'default' | 'server' | 'cache';
}
