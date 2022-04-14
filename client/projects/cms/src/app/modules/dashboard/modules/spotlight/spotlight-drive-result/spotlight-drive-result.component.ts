import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {take, tap} from 'rxjs/operators';
import {DriveItem} from 'definitions';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'jms-spotlight-drive-result',
  templateUrl: './spotlight-drive-result.component.html',
  styleUrls: ['./spotlight-drive-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotlightDriveResultComponent implements OnInit {

  @Input()
  url: string;

  packet$: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.packet$ = this.http.get(this.url);
  }

  selectItem(event) {
    event.preventDefault();
    event.stopPropagation();

    this.packet$.pipe(
      take(1),
      tap((item: {
        data: DriveItem,
        module: string,
        moduleName: string
      }) => {
        console.log(item);

        this.dialog.closeAll();

        const path = item.data.path.split('/').map(it => it === '.' ? '' : it).filter(it => !!it).join('/');
        this.router.navigateByUrl('drive/' + path);
      })
    ).subscribe();

    console.log('selectItem');
  }
}
