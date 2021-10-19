import {Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';

@Component({
  selector: 'jms-sample-email',
  templateUrl: './sample-email.component.html',
  styleUrls: ['./sample-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleEmailComponent implements OnInit {
  constructor(
    private db: DbService,
    private dialog: MatDialog
  ) { }

  @ViewChild('dg', {static: true}) dialogRef: TemplateRef<any>;
  @Input() id: string;

  open() {
    return () => this.db.getDocument('automatic-emails', this.id)
      .pipe(
        tap(() => {
          this.dialog.open(this.dialogRef, {width: '600px'});
        })
      );
  }
}
