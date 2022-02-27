import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomComponent, CustomComponentData, CUSTOM_COMPONENT_DATA} from '@jaspero/form-builder';
import {random} from '@jaspero/utils';
import {DbService} from '../../../../services/db/db.service';

@Component({
  selector: 'jms-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DuplicateComponent extends CustomComponent {
  constructor(
    @Inject(CUSTOM_COMPONENT_DATA)
    public data: CustomComponentData,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private db: DbService
  ) {
    super(data);
  }

  duplicate() {
    this.data.form.get('id').setValue(random.string(20));
    const data = this.data.form.getRawValue();

    return this.router.navigate(['..', 'new'], {
      state: {
        data
      },
      relativeTo: this.activatedRoute
    });
  }
}
