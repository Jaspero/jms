import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {LayoutModule} from '../../../shared/modules/layout/layout.module';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TranslocoRootModule} from './transloco-root.module';
import {appInit} from './utils/app-init';

export function init(injector: Injector) {
  return () => {
    return appInit(injector);
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

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

    LayoutModule,

    MatSnackBarModule,

    /**
     * External
     */
    TranslocoRootModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [Injector],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
