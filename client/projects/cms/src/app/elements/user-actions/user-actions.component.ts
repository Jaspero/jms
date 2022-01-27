import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
import {queue} from '../../shared/utils/queue.operator';

interface Provider {
  label: string;
  icon?: string;
  svg?: string;
  data: any;
}
@UntilDestroy()
@Component({
  selector: 'jms-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionsComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private dbService: DbService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.iconRegistry.addSvgIconLiteral('google', this.sanitizer.bypassSecurityTrustHtml(`
      <svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" focusable="false">
        <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"></path>
        <path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"></path>
        <path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"></path>
        <path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"></path>
      </svg>
    `));
  }

  @ViewChild('providerDialog', {read: TemplateRef}) providerTemplate: TemplateRef<any>
  @Input() id: string;

  status: FormControl;
  providers: Provider[] = [];
  loading = true;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
    lastRefreshTime?: string;
  };
  multiFactors: Provider[] = [];
  provider: {
    data: Array<{label: string; value: any;}>;
  }; 

  ngOnInit() {

    const providerMap = {
      'google.com': {
        svg: 'google',
        label: 'ELEMENTS.USER_ACTIONS.GOOGLE'
      },
      password: {
        icon: 'email',
        label: 'ELEMENTS.USER_ACTIONS.EMAIL_PASSWORD'
      }
    };
    const multiFactorMap = {
      phone: {
        icon: 'phone',
        label: 'ELEMENTS.USER_ACTIONS.PHONE'
      }
    }

    this.dbService.callFunction('cms-getUser', this.id)
      .pipe(
        queue(),
        catchError((error => {
          this.status = new FormControl(false);
          this.loading = false;
          this.cdr.markForCheck();
          console.error(error);
          return throwError(() => error);
        })),
        tap(user => {
          this.status = new FormControl(user.disabled);

          this.providers = user.providerData.map(data => {
            const type = providerMap[data.providerId];
            return {...type, data};
          });
          this.metadata = user.metadata;

          if (user.multiFactor?.enrolledFactors) {
            this.multiFactors = user.multiFactor.enrolledFactors.map(data => {
              const type = multiFactorMap[data.factorId];
              return {...type, data};
            })
          }

          this.loading = false;
          this.cdr.markForCheck();
        }),
        switchMap(() =>
          this.status.valueChanges
        ),
        switchMap(disabled =>
          this.dbService.callFunction('cms-updateUser', {
            id: this.id,
            disabled
          })
        ),
        untilDestroyed(this)
      )
      .subscribe();
  }

  dummy(event) {
    event.stopPropagation();
  }

  openProvider(data: any) {

    this.provider = {
      data: []
    };

    for (const key in data) {
      this.provider.data.push({
        label: key,
        value: data[key]
      });
    }

    this.dialog.open(
      this.providerTemplate,
      {
        width: '600px'
      }
    )
  }
}
