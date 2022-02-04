import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
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

  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = combineLatest([this.state.routeLoading$])
      .pipe(
        map(loadings => loadings.some(Boolean))
      );
  }
}
