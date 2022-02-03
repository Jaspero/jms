import {AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';

export function isObservableLike(value: any): boolean {
  const constructor = value?.constructor;

  return [
    Observable,
    Subject,
    BehaviorSubject,
    ReplaySubject,
    AsyncSubject
  ].includes(constructor);
}
