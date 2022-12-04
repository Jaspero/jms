import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {getAnalytics, provideAnalytics} from '@angular/fire/analytics';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';
import {connectStorageEmulator, getStorage, provideStorage} from '@angular/fire/storage';
import {SHARED_CONFIG} from '@definitions';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {environment} from '../../src/environments/environment';
import {FbStorageService} from './fb-storage.service';
import {MongoDatabaseService} from './mongo-database.service';

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();

      if (environment.firebaseEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      enableMultiTabIndexedDbPersistence(firestore)
        .then(() => true, () => false);

      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();

      if (environment.firebaseEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }

      return storage;
    }),
    provideAuth(() => {
      const auth = getAuth();

      if (environment.firebaseEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
      }

      return auth;
    }),
    provideFunctions(() => {
      const functions = getFunctions(undefined, SHARED_CONFIG.cloudRegion);

      if (environment.firebaseEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5000);
      }

      return functions;
    }),
    provideAnalytics(() => getAnalytics())
  ]
})
export class MongoFirebaseModule {
  constructor(@Optional() @SkipSelf() parentModule: MongoFirebaseModule) {
    if (parentModule) {
      throw new Error(
        'MongoFirebaseModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<MongoFirebaseModule> {
    return {
      ngModule: MongoFirebaseModule,
      providers: [
        MongoDatabaseService,
        FbStorageService,
        {
          provide: DbService,
          useExisting: MongoDatabaseService
        }
      ]
    };
  }
}

