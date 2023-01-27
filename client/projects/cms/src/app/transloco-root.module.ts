import {HttpClient} from '@angular/common/http';
import {Injectable, NgModule} from '@angular/core';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TRANSLOCO_SCOPE
} from '@ngneat/transloco';
import {environment} from '../environments/environment';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): any {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [{
          id: 'en',
          label: 'English'
        }],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: false,
        prodMode: environment.production,
        missingHandler: {
          logMissingKey: false
        }
      })
    },
    {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader},
    {
      provide: TRANSLOCO_SCOPE,
      useValue: [
        'fb-fields-mat',
        'fb-pb',
        'jmsp-notes'
      ]
    }
  ]
})
export class TranslocoRootModule { }
