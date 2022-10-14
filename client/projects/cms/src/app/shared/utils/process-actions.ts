import {safeEval} from '@jaspero/utils';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {ModuleInstanceAction, ModuleLayoutTableSelectionAction} from '@definitions';
import {
  InstanceOverviewContextService
} from '../../modules/dashboard/modules/module-instance/services/instance-overview-context.service';
import {Action} from '../interfaces/action.interface';
import {toObservable} from './to-observable';
import {BehaviorSubject} from 'rxjs';

export function processActions(
  role: string,
  actions: (ModuleLayoutTableSelectionAction | ModuleInstanceAction)[],
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

      const children = processActions(role, cur.children || [], ioc);

      const criteria = cur.criteria &&
        (
          ioc.selection &&
          ioc.selection.changed.pipe(
            startWith(ioc.selection.selected),
            switchMap(selection =>
              toObservable((cur.criteria && safeEval(cur.criteria))?.(selection))
            ),
            map(value => ({value})),
            shareReplay(1)
          )
        ) || new BehaviorSubject({value: safeEval(cur.criteria || undefined)});
      const parsed = safeEval(cur.value);

      if (parsed) {
        acc.push({
          menuStyle: cur.menuStyle,
          value: toObservable(parsed).pipe(shareReplay(1)),
          criteria,
          children
        });
      }
    }

    return acc;
  }, []);
}
