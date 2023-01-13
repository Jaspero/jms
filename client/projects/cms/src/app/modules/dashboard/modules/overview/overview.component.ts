import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'jms-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule
  ],
  standalone: true
})
export default class OverviewComponent {}
