import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {USE_EMULATOR as USE_FIRESTORE_EMULATOR} from '@angular/fire/firestore/firestore';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from '../../../cms/src/environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
  ],
  providers: [
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.firebaseEmulators ? ['localhost', 8080] : undefined
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
