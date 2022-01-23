export type Action<T = any> = (it: any) => {
  criteria?: (d: any) => boolean;
  value: (d: T) => string;
};
