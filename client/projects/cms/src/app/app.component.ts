import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {StateService} from './shared/services/state/state.service';
import {UtilService} from './shared/services/util/util.service';
import {Diff2HtmlUI} from 'diff2html/lib/ui/js/diff2html-ui';

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
  loading$: Observable<boolean>;

  constructor(
    private state: StateService,
    private util: UtilService
  ) {
  }

  ngOnInit() {

    const input = `{
  "role": "",
  "id": "OymWyVBBPwRLpR05IeNtcmo56cn2",
  "createdOn": 1649007674951,
  "active": true,
  "requireReset": false,
  "email": "amarishk9@gmail.com"
}`;

    const diff = new Diff2HtmlUI(document.querySelector('#test'), input);
    diff.draw();

    this.util.init();

    this.loading$ = this.state.loadingQue$.pipe(
      debounceTime(200),
      map(items => !!items.length)
    );
  }
}
