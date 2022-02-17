import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {LayoutModule} from '../../../shared/modules/layout/layout.module';
import {LANG_SUFFIX} from '../../../shared/modules/page/lang-suffix.token';
import {initialState} from '../../../shared/utils/initial-state';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LANGUAGE} from './consts/language.const';
import {TranslocoRootModule} from './transloco-root.module';

export function init(injector: Injector) {
  return () => {
    return initialState(injector);
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
    },
    {
      provide: LANG_SUFFIX,
      useValue: LANGUAGE.short
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
