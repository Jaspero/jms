import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {StateService} from './shared/services/state/state.service';
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
    private state: StateService,
    private util: UtilService
  ) {}

  loading$: Observable<boolean>;

  ngOnInit() {

    this.util.init();
    this.fontHandler();

    this.loading$ = this.state.loadingQue$.pipe(
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
