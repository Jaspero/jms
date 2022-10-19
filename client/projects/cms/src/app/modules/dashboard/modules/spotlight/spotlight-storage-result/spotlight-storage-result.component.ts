import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {StorageItem} from '@definitions';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';

@Component({
  selector: 'jms-spotlight-storage-result',
  templateUrl: './spotlight-storage-result.component.html',
  styleUrls: ['./spotlight-storage-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotlightStorageResultComponent implements OnInit {

  @Input()
  url: string;

  packet$: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.packet$ = this.http.get(this.url);
  }

  selectItem(event) {
    event.preventDefault();
    event.stopPropagation();

    this.packet$.pipe(
      take(1),
      tap((item: {
        data: StorageItem,
        module: string,
        moduleName: string
      }) => {
        this.dialog.closeAll();

        const path = item.data.path.split('/').map(it => it === '.' ? '' : it).filter(it => !!it).join('/');
        this.router.navigateByUrl('storage/' + path);
      })
    )
      .subscribe();
  }
}
