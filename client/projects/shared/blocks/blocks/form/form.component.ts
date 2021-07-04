import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OnChange} from '@jaspero/ng-helpers';
import {from, Subject, Subscription, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {FormField} from '../../interfaces/form-field.interface';
import {Form} from '../../interfaces/form.interface';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface FormOptions extends CommonOptions {
  title?: string;
  description?: string;
  action?: string;
  form?: string;
  email?: string;
}

@Component({
  selector: 'jms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent extends CommonBlockComponent {
  constructor(
    public el: ElementRef,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super(el);
  }

  @OnChange(function() {this.onChange()})
  @Input()
  data: FormOptions;

  form: Form;
  fg: FormGroup = this.fb.group({});

  loading = true;

  notification$ = new Subject<{
    message: string;
    error?: boolean;
  }>();

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

  submit() {
    return () => {
      return from(
        this.afs
          .collection(`forms/${this.form.id}/submissions`)
          .doc(this.afs.createId())
          .set({
            createdOn: Date.now(),
            ...this.data.email && {emailId: this.data.email},
            ...this.fg.getRawValue()
          })
      ).pipe(
        tap(() => {
          this.fg.reset();
          this.notification$.next({
            message:
              this.form.success ||
              'Application submitted successfully. Thank you!'
          });
        }),
        catchError(err => {
          this.notification$.next({
            error: true,
            message:
              this.form.error ||
              'There was an error submitting your form, please try again later.'
          });

          console.error(err);
          return throwError(err);
        })
      );
    };
  }

  onChange() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.data.form) {
      this.subscription = this.afs
        .collection('forms')
        .doc(this.data.form)
        .get()
        .subscribe(res => {
          this.form = {
            id: res.id,
            ...res.data() as any
          } as Form;

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

          this.loading = false;
          this.cdr.markForCheck();
        });
    }

    this.cdr.markForCheck();
  }
}
