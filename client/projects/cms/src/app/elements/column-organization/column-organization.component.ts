import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TranslocoService} from '@ngneat/transloco';
import {ModuleLayoutTableColumn} from '@definitions';

interface AdjustableColumn {
  data: ModuleLayoutTableColumn;
  active: FormControl;
  label: FormControl;
}

@Component({
  selector: 'jms-column-organization',
  templateUrl: './column-organization.component.html',
  styleUrls: ['./column-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnOrganizationComponent implements OnInit {
  constructor(
    private transloco: TranslocoService
  ) {}

  @Input()
  tableColumns: ModuleLayoutTableColumn[];

  columns: AdjustableColumn[];

  ngOnInit() {
    this.columns = this.tableColumns.map(data => ({
      data,
      active: new FormControl(!data.disabled),
      label: new FormControl(this.transloco.translate(data.label))
    }));
  }

  drop(event: CdkDragDrop<AdjustableColumn[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  allComplete() {
    return !this.columns.some(it => !it.active.value);
  }

  someComplete() {
    return this.columns.some(it => it.active.value) && !this.allComplete();
  }

  toggleAll(value) {
    this.columns.forEach(it =>
      it.active.setValue(value)
    )
  }

  save(): ModuleLayoutTableColumn[] {
    return this.columns.map(it => ({
      ...it.data,
      label: it.label.value,
      disabled: !it.active.value
    }));
  }
}
