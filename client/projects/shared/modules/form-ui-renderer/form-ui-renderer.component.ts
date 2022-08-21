import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DbService} from '@jaspero/form-builder';
import {random} from '@jaspero/utils';
import {OnChange} from '@jaspero/ng-helpers';
import {FormField} from '@shared/blocks/interfaces/form-field.interface';
import {Form} from '@shared/blocks/interfaces/form.interface';
import {notify} from '@shared/utils/notify.operator';
import {BehaviorSubject, from, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'jms-form-ui-renderer',
  templateUrl: './form-ui-renderer.component.html',
  styleUrls: ['./form-ui-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormUiRendererComponent {
  constructor(
    private db: DbService,
    private fb: FormBuilder
  ) { }

  @OnChange(function() {
    this.triggerChange();
  })
  @Input() data: {
    action?: string;
    email: string;
    id: string;
  };

  form: Form;
  fg: FormGroup = this.fb.group({});
  loading$ = new BehaviorSubject(true);

  private subscription: Subscription;

  fieldValid(field: FormField) {
    if (!field.conditions || !field.conditions.length) {
      return true;
    }

    return field.conditions.some(condition => {
      const value = this.fg.get(condition.form).value;

      switch (condition.type) {
        case 'equal':
          return value === condition.value;
        case 'larger-then':
          return value > condition.value;
        case 'smaller-then':
          return value < condition.value;
      }
    });
  }

  onCheckboxChange(event: any, id?: string) {

    const control = this.fg.get(id);
    const value = event.target.value;

    if (event.target.checked) {
      control.value.push(value);
    } else {
      control.value.splice(control.value.indexOf(value), 1);
    }

    control.setValue(control.value);
  }

  triggerChange() {
    this.loading$.next(true);

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    // @ts-ignore
    this.subscription = this.db.getDocument('forms', this.data.id)
      .subscribe(res => {
        this.form = res as Form;

        this.fg = this.fb.group(
          this.form.fields.reduce((acc, cur) => {
            acc[cur.id] = [
              cur.value || (cur.type === 'checkbox' ? [] : ''),
              [
                ...(cur.required ? [Validators.required] : []),
                ...(cur.type === 'email' ? [Validators.email] : [])
              ]
            ];
            return acc;
          }, {})
        );

        this.loading$.next(false);
      });
  }

  submit() {
    return () => {
      return from(
        // @ts-ignore
        this.db.setDocument(
          `forms/${this.form.id}/submissions`,
          'fa-' + random.string(),
          {
            createdOn: Date.now(),
            ...this.data.email && {emailId: this.data.email},
            ...this.fg.getRawValue()
          }
        )
      ).pipe(
        tap(() => this.fg.reset()),
        notify({
          success: this.form.success,
          error: this.form.error
        })
      );
    };
  }
}
