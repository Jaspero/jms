import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'jms-spotlight-result',
  templateUrl: './spotlight-result.component.html',
  styleUrls: ['./spotlight-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotlightResultComponent implements OnInit {

  @Input()
  url: string;

  @Input()
  label = 'name';

  packet$: Observable<any>;

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.packet$ = this.http.get(this.url);
  }

}
