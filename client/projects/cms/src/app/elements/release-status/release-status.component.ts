import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StateService} from '../../shared/services/state/state.service';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-release-status',
  templateUrl: './release-status.component.html',
  styleUrls: ['./release-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseStatusComponent implements OnInit {
  constructor(
    private state: StateService
  ) { }

  @Input()
  updated: number;

  status$: Observable<{message: string; color: string;}>

  ngOnInit() {
    this.status$ = this.state.lastPublished$
      .pipe(
        map(date => {
          if (!date || !this.updated) {
            return {message: 'NOT_CONFIGURED', color: '#bcaaa4'}
          } else if (date > this.updated) {
            return {message: 'LIVE', color: '#4caf50'}
          } else {
            return {message: 'NOT_LIVE', color: '#f44336'}
          }
        })
      )
  }

}
