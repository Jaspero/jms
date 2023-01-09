import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {loadingQueue$} from './modules/dashboard/modules/module-instance/utils/loading-queue';
import {UtilService} from './shared/services/util/util.service';

declare global {
  interface Window {
    // @ts-ignore
    jms: {
      util: UtilService
    };
  }
}

@Component({
  selector: 'jms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    private util: UtilService
  ) {}

  loading$: Observable<boolean>;

  ngOnInit() {

    this.util.init();
    this.fontHandler();

    this.loading$ = loadingQueue$.pipe(
      debounceTime(200),
      map(items => !!items.length)
    );
  }

  fontHandler() {

    const cls = 'fonts-loaded';

    if (!document.fonts?.ready) {
      document.body.classList.add(cls);
      return;
    }

    document.fonts.ready
      .then(() =>
        document.body.classList.add(cls)
      );
  }
}
