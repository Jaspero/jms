import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpersonateComponent {
  constructor(
    private dbService: DbService,
  ) { }

  @Input() id: string;

  trigger() {
    return () =>
      this.dbService.callFunction('cms-impersonate', this.id)
        .pipe(
          tap(token =>
            window.open(location.origin + '/impersonate?token=' + token, '_self')
          )
        )
  }
}
