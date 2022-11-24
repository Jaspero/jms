import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FieldComponent, FieldData} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {MODULES} from '@definitions';
import {MatCheckboxChange} from '@angular/material/checkbox';

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
  initialRowValues = {};

  ngOnInit() {
    const {value} = this.cData.control;

    this.group = new FormGroup(
      [...this.modules, ...this.addedModules].reduce((acc, cur) => {
        acc[cur.id] = new FormGroup({
          get: new FormControl(value[cur.id]?.get || false),
          list: new FormControl(value[cur.id]?.list || false),
          create: new FormControl(value[cur.id]?.create || false),
          update: new FormControl(value[cur.id]?.update || false),
          delete: new FormControl(value[cur.id]?.delete || false),
        });
        return acc;
      }, {})
    );

    this.initialRowValues = this.modules.reduce((acc, cur) => {
      acc[cur.id] = Object.values(value[cur.id]).every(it => it);
      return acc;
    }, {});

    this.addedModules.forEach(it => {
      this.initialRowValues[it.id] = Object.values(value[it.id]).every(it => it);
    });

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
        }
      );
  }

  toggleRow(id: string, event: MatCheckboxChange) {
    this.group.get(id).setValue(
      this.permissions.reduce((acc, cur) => {
        acc[cur.value] = event.checked;
        return acc;
      }, {})
    );
  }
}
