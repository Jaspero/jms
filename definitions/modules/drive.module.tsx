import {Module} from '../interfaces/module.interface';
import JSX from '../jsx.compiler';

export const DRIVE_MODULE: Module = {
  id: 'drive',
  name: 'Drive',
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      path: {type: 'string'},
      type: {type: 'string'},
      /**
       * Type object
       */
      metadata: {type: 'string'},
      contentType: {type: 'string'},
      createdOn: {type: 'number'},
      size: {type: 'number'}
    }
  },
  spotlight: {
    queryFields: ['name', 'path', 'contentType'],
    template: (packet) => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(packet)], {type: 'application/json'}));
      return JSX(<jms-spotlight-result url={url} label='email' />)
    }
  },
};
