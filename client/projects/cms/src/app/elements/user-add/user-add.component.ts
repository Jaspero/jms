import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {random} from '@jaspero/utils';
import {UntilDestroy} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {Observable, of} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../integrations/firebase/firestore-collection.enum';
import {Role} from '../../shared/interfaces/role.interface';
import {DbService} from '../../shared/services/db/db.service';
import {Element} from '../element.decorator';

@Element()
@UntilDestroy({checkProperties: true})
@Component({
  selector: 'jms-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService,
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild('addDialog', {static: true})
  addDialogTemplate: TemplateRef<any>;
  roles$: Observable<Role[]>;
  form: FormGroup;
  type = 'password';
  accountTypes = [
    {value: 'manual', label: 'Manually set password'},
    {value: 'invite', label: 'Send an invite'},
    {value: 'third-party', label: 'Third Party'}
  ];
  accountType = new FormControl('invite');

  ngOnInit() {
    this.roles$ = this.dbService.getDocumentsSimple(FirestoreCollection.Roles)
      .pipe(
        shareReplay(1)
      );

    this.accountType.valueChanges
      .subscribe(() => {
        this.form.get('password').setValue('');
        this.form.get('requireReset').setValue(false);
      });
  }

  toggleType() {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.cdr.markForCheck();
  }

  generateRandomPassword() {
    this.form.get('password').setValue(random.string());
  }

  open() {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: '',
      requireReset: false
    });

    this.dialog.open(
      this.addDialogTemplate,
      {
        width: '600px'
      }
    );
  }

  add() {
    return () => {

      const type = this.accountType.value;

      if (type === 'invite') {
        this.generateRandomPassword();
      }

      const data = this.form.getRawValue();

      data.email = data.email.toLowerCase().trim();

      if (data.password) {
        data.password = data.password.trim();
      }

      return this.dbService.setDocument(
        'user-invites',
        data.email,
        {
          createdOn: Date.now(),
          role: data.role,
          requireReset: data.requireReset,
          sendInvite: type === 'invite',
        },
        {merge: true}
      )
        .pipe(
          switchMap(() => {
            if (data.password) {
              return this.dbService
                .createUserAccount(data.email, data.password);
            }

            return of(true);
          }),
          notify({
            showThrownError: true
          }),
          tap(() => {
            this.dialog.closeAll();
          })
        );
    };
  }
}
