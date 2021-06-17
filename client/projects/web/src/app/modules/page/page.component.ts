import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Page} from './page.interface';

@Component({
  selector: 'jms-w-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  page$: Observable<Page>;

  ngOnInit() {
    this.page$ = this.activatedRoute.data
      .pipe(
        map(({page}) => page)
      );
  }
}
