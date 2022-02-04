import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {StateService} from './shared/services/state/state.service';
import {UtilService} from './shared/services/util/util.service';

declare global {
  interface Window {
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
  loading$: Observable<boolean>;

  constructor(
    private state: StateService,
    private util: UtilService
  ) {
  }

  ngOnInit() {
    this.util.init();

    this.loading$ = this.state.loadingQue$.pipe(
      debounceTime(200),
      map(items => !!items.length)
    );
  }
}
