import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {SETTINGS_COLLECTION} from '../../../setup/collections/settings.collection';
import {MODULES} from '../../../setup/modules/modules';
import {Layout} from '../../src/app/shared/interfaces/layout.interface';
import {SchemaService} from '../../src/app/shared/services/schema/schema.service';

@Injectable()
export class LocalSchemaService extends SchemaService {

  constructor() {
    super();
  }

  modules$ = of(MODULES as any);

  layout$ = of(SETTINGS_COLLECTION.documents.find(document => document.id === 'layout') as (Layout & {id: string}));
}
