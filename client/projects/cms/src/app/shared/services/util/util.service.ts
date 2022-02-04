import {Injectable} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {StateService} from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    public state: StateService,
    public transloco: TranslocoService
  ) {}

  init() {
    if (!window.jms) {
      window.jms = {
        util: this
      };
      return;
    }

    window.jms.util = this;
  }
}
