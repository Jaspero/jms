export const arrayToObject = <T>(keys: string[], values: any[]): T => {
  return keys.reduce((obj, key, i) => {
    obj[key] = values[i] || undefined;
    return obj;
  }, {} as T);
};
