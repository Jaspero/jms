import {Injectable} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {StateService} from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    public state: StateService,
    public transloco: TranslocoService,
    // public afs: AngularFirestore
  ) {}

  /**
   * ID of the currently open document
   */
  docId: string;

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
