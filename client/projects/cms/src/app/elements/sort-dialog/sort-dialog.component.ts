import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SortModule} from '@definitions';
import {swapItems} from '@jaspero/utils';
import {notify} from '@shared/utils/notify.operator';
import {forkJoin, from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';

@Component({
  selector: 'jms-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      options: SortModule;
      collection: string;
      collectionName: string;
    },
    private dbService: DbService,
    private dialogRef: MatDialogRef<SortDialogComponent>
  ) {}

  items$: Observable<any>;
  updateMap: {[key: string]: number} = {};

  ngOnInit() {
    this.items$ = this.dbService.getDocumentsSimple(
      this.data.collection,
      this.data.options.sortKey
    );
  }

  drop(items: any[], event: CdkDragDrop<string[]>) {
    this.updateMap[items[event.previousIndex].id] = event.currentIndex;
    this.updateMap[items[event.currentIndex].id] = event.previousIndex;
    swapItems(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: any[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    this.updateMap[items[index].id] = currentIndex;
    this.updateMap[items[currentIndex].id] = index;
    swapItems(items, index, currentIndex);
  }

  update() {
    return () => {
      const data = Object.entries(this.updateMap);

      if (!data.length) {
        return of([]);
      }

      return forkJoin(
        data.map(([id, order]) =>
          from(
            this.dbService.setDocument(
              this.data.collection,
              id,
              {
                [this.data.options.sortKey]: order
              },
              {
                merge: true
              }
            )
          )
        )
      ).pipe(
        notify(),
        tap(() => this.dialogRef.close())
      );
    };
  }
}
