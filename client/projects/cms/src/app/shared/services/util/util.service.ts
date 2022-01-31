import {Injectable} from '@angular/core';
import {StateService} from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    public state: StateService
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
