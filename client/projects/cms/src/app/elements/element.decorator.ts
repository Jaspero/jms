import {ɵNG_COMP_DEF} from '@angular/core';
import {STATIC_CONFIG} from '../../environments/static-config';

export interface ElementOptions {
};

export const ELEMENTS = {};

export function createSelector(selector: string) {

  if (selector.startsWith('<')) {
    return selector;
  }

  return selector.startsWith(STATIC_CONFIG.elements.selectorPrefix) ?
    selector :
    (STATIC_CONFIG.elements.selectorPrefix + selector.replace(STATIC_CONFIG.elements.componentPrefix, ''));
}

export function Element(options?: ElementOptions): ClassDecorator {
  return (type: any) => {

    const componentDef = type[ɵNG_COMP_DEF];

    if (componentDef === undefined) {
      throw new Error('Ivy is not enabled.');
    }

    const [originalSelector] = componentDef.selectors[0];

    ELEMENTS[createSelector(originalSelector)] = type;
  };
}
