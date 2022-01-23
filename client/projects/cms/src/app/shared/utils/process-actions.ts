import {safeEval} from '@jaspero/utils';
import {Action} from '../interfaces/action.interface';
import {ModuleLayoutTableAction} from '../interfaces/module-layout-table.interface';

export function processActions(
  role: string,
  actions: ModuleLayoutTableAction[]
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

      const criteria = cur.criteria && safeEval(cur.criteria);
      const parsed = safeEval(cur.value);

      if (parsed) {
        acc.push({
          value: parsed,
          ...(criteria && {criteria})
        });
      }
    }

    return acc;
  }, []);
}
