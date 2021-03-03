import {CREATED_ON} from './shared/created-on';

export const DOGS_MODULE = {
  id: 'dogs',
  name: 'Dogs',
  description: 'List of all dogs',
  authorization: {
    read: ['admin', 'user'],
    write: ['admin']
  },
  layout: {
    instance: {
      segments: [
        {
          fields: ['/id', '/name', '/image', '/type']
        }
      ]
    },
    table: {
      hideImport: true,
      tableColumns: [
        {
          key: '/name',
          label: 'Name'
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      image: {
        type: 'array'
      },
      type: {
        type: 'string'
      },
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {
      type: 'ID'
    },
    name: {
      label: 'Name'
    },
    image: {
      label: 'Image',
      component: {
        type: 'gallery'
      }
    },
    type: {
      label: 'Tip',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
              {
                name: 'Puppy',
                value: 'puppy'
              },
              {
                name: 'Medium',
                value: 'medium'
              }
            ]
        }
      }
    },
    ...CREATED_ON.definition()
  }
};
