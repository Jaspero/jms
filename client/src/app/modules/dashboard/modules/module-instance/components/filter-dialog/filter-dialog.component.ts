import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {State, Parser, safeEval} from '@jaspero/form-builder';
import {FilterMethod} from '../../../../../../shared/enums/filter-method.enum';
import {FilterModule, FilterModuleDefinition} from '../../../../../../shared/interfaces/filter-module.interface';
import {WhereFilter} from '../../../../../../shared/interfaces/where-filter.interface';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';

@Component({
  selector: 'jms-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      module: FilterModule,
      ioc: InstanceOverviewContextService
    },
    private dialogRef: MatDialogRef<FilterDialogComponent>
  ) {}

  apply(form: FormGroup, parser: Parser, override?: any) {

    parser.preSaveHooks(
      State.Create,
      []
    );

    const data = override || form.getRawValue();
    let toSend: WhereFilter[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {

        const definition = ((this.data.module.definitions || {})[key] || {}) as FilterModuleDefinition;
        const value = data[key];

        let displayValue: any = value;

        if (
          value !== undefined &&
          value !== null &&
          !Number.isNaN(value) &&
          value !== ''
        ) {
          if (definition.filterValuePipe) {
            displayValue = this.data.ioc.columnPipe.transform(
              displayValue,
              definition.filterValuePipe,
              definition.filterValuePipeArguments,
              {[definition.filterKey || key]: displayValue}
            )
          }

          toSend.push({
            value,
            displayValue,
            key: definition.filterKey || key,
            operator: definition.filterMethod || FilterMethod.Equal,
            ...definition.filterLabel && {label: definition.filterLabel},
            ...this.data.module.persist && {persist: this.data.module.persist}
          });
        }
      }
    }

    if (this.data.module.formatOnSubmit) {
      const formatOnSubmit = safeEval(this.data.module.formatOnSubmit);

      if (formatOnSubmit) {
        toSend = formatOnSubmit(toSend);
      }
    }

    this.dialogRef.close(toSend);
  }
}
