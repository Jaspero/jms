import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterMethod, FilterModule, FilterModuleDefinition, PipeType} from '@definitions';
import {Parser, State} from '@jaspero/form-builder';
import {safeEval} from '@jaspero/utils';
import {AsyncSubject, BehaviorSubject, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {WhereFilter} from '../../shared/interfaces/where-filter.interface';
import {InstanceOverviewContextService} from '../../modules/dashboard/modules/module-instance/services/instance-overview-context.service';

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
  ) {
  }

  apply(form: FormGroup, parser: Parser, override?: any) {
    return () => {

      parser.preSaveHooks(
        State.Create,
        []
      );

      const data = override || form.getRawValue();
      const pipes: any[] = [];
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

            const insert = () => toSend.push({
              value,
              displayValue,
              key: definition.filterKey || key,
              operator: definition.filterMethod || FilterMethod.Equal,
              ...(definition.filterLabel || definition.label) && {label: definition.filterLabel || definition.label},
              ...this.data.module.persist && {persist: this.data.module.persist}
            });

            if (definition.filterValuePipe) {

              if (!Array.isArray(definition.filterValuePipe)) {
                definition.filterValuePipe = [definition.filterValuePipe];
              }

              for (const [i, item] of (definition.filterValuePipe as Array<PipeType>).entries()) {
                pipes.push(
                  switchMap(() => {
                    displayValue = this.data.ioc.columnPipe.transform(
                      displayValue,
                      item,
                      (definition.filterValuePipeArguments || [])[i]
                    );

                    const constructor = displayValue?.constructor;
                    if ([
                      Observable,
                      Subject,
                      BehaviorSubject,
                      ReplaySubject,
                      AsyncSubject
                    ].includes(constructor)
                    ) {
                      return displayValue
                        .pipe(
                          map(value =>
                            displayValue = value
                          )
                        );
                    } else {
                      return of(displayValue);
                    }
                  })
                );
              }

              pipes.push(tap(() => insert()));
            } else {
              insert();
            }
          }
        }
      }

      if (this.data.module.formatOnSubmit) {
        const formatOnSubmit = safeEval(this.data.module.formatOnSubmit);

        if (formatOnSubmit) {
          toSend = formatOnSubmit(toSend);
        }
      }

      return of(true)
        .pipe(
          // @ts-ignore
          ...pipes,
          tap(() =>
            this.dialogRef.close(toSend)
          )
        );
    };
  }
}
