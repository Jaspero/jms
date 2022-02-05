import {Layout} from '../interfaces/layout.interface';

export const INITIAL_STATE: {
  layout?: Layout;
  collections: {
    [key: string]: {
      [key: string]: any
    }
  }
} = {
  collections: {}
};
