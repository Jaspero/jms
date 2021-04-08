import {Injectable} from '@angular/core';
import {defer} from 'rxjs';
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

  modules$ = defer(() => this.dbService.getModules());
  layout$ = defer(() => this.dbService.getDocument(FirestoreCollection.Settings, 'layout'));
}
