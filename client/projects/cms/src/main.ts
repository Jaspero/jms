import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(module => {
    /**
     * Gives us a global reference to the injector
     */
    (window as any).rootInjector = module.injector;
  })
  .catch(err => console.error(err));
