import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FieldComponent, FieldData} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MODULES} from '@definitions';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {BehaviorSubject} from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'jms-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent extends FieldComponent<FieldData> implements OnInit {
  group: FormGroup;
  modules = MODULES.filter(it =>
    /**
     * Check that it's not a subcollection
     * currently we only handle permissions
     * for top level collections.
     */
    !it.id.includes('{')
  );
  permissions = [
    {name: 'GET', value: 'get'},
    {name: 'LIST', value: 'list'},
    {name: 'CREATE', value: 'create'},
    {name: 'UPDATE', value: 'update'},
    {name: 'DELETE', value: 'delete'}
  ];
  addedModules = [
    {id: '_search', name: 'SEARCH', permissions: ['list']}
  ];
  rowValues$ = new BehaviorSubject({});
  columnValues$ = new BehaviorSubject(null);
  overallValues$ = new BehaviorSubject({});

  ngOnInit() {
    const {value} = this.cData.control;

    this.group = new FormGroup(
      [...this.modules, ...this.addedModules].reduce((acc, cur) => {
        acc[cur.id] = new FormGroup({
          get: new FormControl(value[cur.id]?.get || false),
          list: new FormControl(value[cur.id]?.list || false),
          create: new FormControl(value[cur.id]?.create || false),
          update: new FormControl(value[cur.id]?.update || false),
          delete: new FormControl(value[cur.id]?.delete || false)
        });
        return acc;
      }, {})
    );

    this.rowValues$.next(this.updateRows());
    this.columnValues$.next(this.updateColumns());
    this.overallValues$.next(this.getOverallValues());

    this.group
      .valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => {
          this.cData.control.setValue(
            Object.entries(value)
              .reduce((acc, [k, v]) => {
                const final = this.permissions.reduce((a, c) => {

                  if (v[c.value]) {
                    a[c.value] = true;
                  }

                  return a;
                }, {});

                if (Object.keys(final).length) {
                  acc[k] = final;
                }

                return acc;
              }, {})
          );

          this.columnValues$.next(this.updateColumns());
          this.rowValues$.next(this.updateRows());
          this.overallValues$.next(this.getOverallValues());
        }
      );
  }

  toggleRow(event: MatCheckboxChange, collection: string) {
    this.group.get(collection).setValue(
      this.permissions.reduce((acc, cur) => {
        acc[cur.value] = event.checked;
        return acc;
      }, {})
    );

    this.columnValues$.next(this.updateColumns());

    this.rowValues$.next({
      ...this.rowValues$.value,
      [collection]: {
        checked: event.checked,
        indeterminate: false
      }
    });
  }

  toggleColumn(type: string, event: MatCheckboxChange) {
    this.modules.forEach(it => {
      this.group.get(`${it.id}.${type}`).setValue(event.checked);
    });

    this.addedModules.forEach(it => {
      this.group.get(`${it.id}.${type}`).setValue(event.checked);
    });

    this.rowValues$.next(this.updateRows());

    this.columnValues$.next({
      ...this.columnValues$.value,
      [type]: {
        checked: event.checked,
        indeterminate: false
      }
    });
  }

  updateRows() {
    const modulesValuesRows = this.modules.reduce((acc, cur) => {
      acc[cur.id] = {
        checked: Object.values(this.group.value[cur.id]).every(it => it),
        indeterminate: Object.values(this.group.value[cur.id]).some(it => it) && !Object.values(this.group.value[cur.id]).every(it => it)
      };
      return acc;
    }, {});

    const addedModulesValuesRows = {};

    this.addedModules.forEach(it => {
      addedModulesValuesRows[it.id] = {
        checked: it.permissions.every(p => this.group.value[it.id][p]),
        indeterminate: it.permissions.some(p => this.group.value[it.id][p]) && !it.permissions.every(p => this.group.value[it.id][p])
      };
    });

    return {
      ...modulesValuesRows,
      ...addedModulesValuesRows
    };
  }

  updateColumns() {
    return this.permissions.reduce((acc, cur) => {
      const values = [];
      for (const module of this.modules) {
        if (this.group.value[module.id][cur.value] !== undefined) {
          values.push(this.group.value[module.id][cur.value]);
        }
      }

      for (const module of this.addedModules) {
        if (module.permissions.includes(cur.value)) {
          values.push(this.group.value[module.id][cur.value]);
        }
      }

      acc[cur.value] = {
        checked: values.every(it => it),
        indeterminate: values.some(it => it) && !values.every(it => it)
      };
      return acc;
    }, {});
  }

  toggleAll(event: MatCheckboxChange) {
    this.modules.forEach(it => {
      this.group.get(it.id).setValue(
        this.permissions.reduce((acc, cur) => {
          acc[cur.value] = event.checked;
          return acc;
        }, {})
      );
    });

    this.addedModules.forEach(it => {
      this.group.get(it.id).setValue(
        this.permissions.reduce((acc, cur) => {
          acc[cur.value] = event.checked;
          return acc;
        }, {})
      );
    });

    this.rowValues$.next(this.updateRows());
    this.columnValues$.next(this.updateColumns());
  }

  getOverallValues() {
    const values = [];
    for (const module of this.modules) {
      values.push(Object.values(this.group.value[module.id]).every(it => it));
    }

    for (const module of this.addedModules) {
      values.push(module.permissions.every(p => this.group.value[module.id][p]));
    }

    return {
      checked: values.every(it => it),
      indeterminate: values.some(it => it) && !values.every(it => it)
    };
  }
}
