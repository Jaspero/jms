import {Module} from '@definitions';

export function findModule(
  modules: Module[],
  query: {[key: string]: string}
) {

  const moduleIds = Object.entries(query).reduce((acc, [key, value]) => {

    if (key.startsWith('module')) {
      acc.push(value)
    }

    return acc;
  }, []);

  const module = modules.find(mod =>
    !moduleIds.some(id => !mod.id.includes(id)) &&
    Math.ceil(mod.id.split('/').filter(Boolean).length / 2) === moduleIds.length
  );

  return module;
}
