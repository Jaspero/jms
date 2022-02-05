import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {INITIAL_STATE} from './consts/initial-state.const';
import {Layout} from './interfaces/layout.interface';
import {StateService} from './services/state/state.service';

@Component({
  selector: 'jms-w-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService
  ) {}

  layout: Layout;
  loading$: Observable<boolean>;

  ngOnInit() {
    this.layout = INITIAL_STATE.layout;
    this.loading$ = combineLatest([this.state.routeLoading$])
      .pipe(
        map(loadings => loadings.some(Boolean))
      );
  }
}
