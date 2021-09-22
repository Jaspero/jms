import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Block} from '@jaspero/fb-page-builder';
import {OnChange} from '@jaspero/ng-helpers';
import {notify} from '@shared/utils/notify.operator';
import {from, Subject, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {FormField} from '../../interfaces/form-field.interface';
import {Form} from '../../interfaces/form.interface';
import {COMMON_OPTIONS} from '../common-options.const';
import {CommonBlockComponent, CommonOptions} from '../common.block';

interface FormOptions extends CommonOptions {
  title?: string;
  description?: string;
  action?: string;
  form?: string;
  email?: string;
}

@Block({
  id: 'form',
  label: 'PB.FORM.BLOCKS.FORM.TITLE',
  icon: 'contact_mail',
  previewValue: {
    title: '<h2>Form Title</h2>',
    description: '<h3>Form description</h3>',
    fields: []
  },
  form: {
    segments: [
      {
        type: 'empty',
        fields: [
          '/form',
          '/email'
        ]
      },
      ...COMMON_OPTIONS.segment
    ],
    schema: {
      properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        form: {type: 'string'},
        email: {type: 'string'},
        ...COMMON_OPTIONS.properties
      }
    },
    definitions: {
      form: {
        component: {
          type: 'ref',
          configuration: {
            collection: 'forms',
            searchBy: {key: '/name', label: 'GENERAL.NAME'},
            display: {key: '/name', label: 'PB.FORM.BLOCKS.FORM.FIELDS.FORM'},
            table: {
              tableColumns: [
                {key: '/name', label: 'GENERAL.NAME'}
              ]
            }
          }
        }
      },
      email: {
        component: {
          type: 'ref',
          configuration: {
            collection: 'automatic-emails',
            searchBy: {key: '/name', label: 'GENERAL.NAME'},
            display: {key: '/name', label: 'GENERAL.EMAIL'},
            table: {
              tableColumns: [
                {key: '/name', label: 'GENERAL.NAME'},
                {key: '/description', label: 'GENERAL.DESCRIPTION'},
              ]
            }
          }
        }
      },
      ...COMMON_OPTIONS.definitions
    }
  }
})
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

  @OnChange(function() {
    this.onChange();
  })
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
        tap(() => this.fg.reset()),
        notify({
          success: this.form.success,
          error: this.form.error
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
