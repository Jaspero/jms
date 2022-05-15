import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {tap} from 'rxjs/operators';
import {confirmation} from '../../../../../../shared/utils/confirmation';
import {InstanceSingleComponent} from '../../pages/instance-single/instance-single.component';

@Injectable()
export class ConfirmExitGuard implements CanDeactivate<InstanceSingleComponent> {
  canDeactivate(component: InstanceSingleComponent): boolean | Promise<boolean> {
    if (!component.confirmExitOnTouched || !(component.formBuilderComponent.form.dirty && component.formBuilderComponent.form.touched)) {
      return true;
    }

    return new Promise((resolve) => {
      confirmation([
        tap((confirm) => resolve(!!confirm))
      ], {
        description: 'TOUCHED_DESCRIPTION',
        confirm: 'YES'
      });
    });
  }
}
