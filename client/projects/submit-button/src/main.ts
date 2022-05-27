import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {SubmitButtonModule} from './app/submit-button.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SubmitButtonModule, {
  ngZone: 'noop'
})
  .catch(err => console.error(err));
