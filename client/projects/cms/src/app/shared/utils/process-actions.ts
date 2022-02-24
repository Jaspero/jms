import {safeEval} from '@jaspero/utils';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {ModuleLayoutTableAction} from '@definitions/interfaces/module-layout-table.interface';
import {InstanceOverviewContextService} from '../../modules/dashboard/modules/module-instance/services/instance-overview-context.service';
import {Action} from '../interfaces/action.interface';
import {toObservable} from './to-observable';

export function processActions(
  role: string,
  actions: ModuleLayoutTableAction[],
  ioc: InstanceOverviewContextService
): Action[] {
  return actions.reduce((acc, cur) => {
    if (!cur.authorization || cur.authorization.includes(role)) {

      const interpolations = typeof cur.value === 'string' ? (
        cur.value.match(/{{\s*[\w.]+\s*}}/g) || []
      ).filter(it => it) : [];

      for (const param of interpolations) {
        cur.value = (cur.value as string).replace(
          param,
          `' + ${param.slice(2, -2)} + '`
        );
      }

      const criteria = ioc.selection.changed.pipe(
        startWith(ioc.selection.selected),
        switchMap((selection) => {
          return toObservable((cur.criteria && safeEval(cur.criteria))?.(selection));
        }),
        map((criteria) => {
          return {
            value: criteria
          };
        }),
        shareReplay(1)
      );
      const parsed = safeEval(cur.value);

      if (parsed) {
        acc.push({
          menuStyle: cur.menuStyle,
          value: toObservable(parsed).pipe(shareReplay(1)),
          ...(criteria && {criteria})
        });
      }
    }

    return acc;
  }, []);
}
