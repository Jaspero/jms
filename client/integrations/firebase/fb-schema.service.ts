import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {SchemaService} from '../../src/app/shared/services/schema/schema.service';
import {FbDatabaseService} from './fb-database.service';
import {FirestoreCollection} from './firestore-collection.enum';

@Injectable()
export class FbSchemaService extends SchemaService {

  constructor(
    private dbService: FbDatabaseService
  ) {
    super();
  }

  modules$ = this.dbService.getModules().pipe(shareReplay(1));

  layout$ = this.dbService.getDocument(
    FirestoreCollection.Settings,
    'layout',
    true
  );
}
