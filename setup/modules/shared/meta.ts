export const META = {
  segment: (options: any = {}) => {
    return {
      type: 'card',
      title: 'Meta Data',
      fields: [
        '/meta/title',
        '/meta/description',
        '/meta/keywords',
        '/meta/structured',
        '/meta/image'
      ],
      ...options
    }
  },
  property: () => {
    return {
      meta: {
        type: 'object',
        properties: {
          structured: {type: 'string'},
          description: {type: 'string'},
          title: {type: 'string'},
          keywords: {type: 'string'},
          image: {type: 'string'}
        }
      }
    }
  },
  definitions: () => {
    return {
      'meta/structured': {
        component: {type: 'textarea'},
        label: 'Structured'
      },
      'meta/title': {label: 'Title'},
      'meta/description': {label: 'Description'},
      'meta/keywords': {label: 'Keywords'},
      'meta/image': {
        label: 'Image',
        component: {
          type: 'image',
          configuration: {
            maxSize: 5e+6,
            generatedImages: [
              {
                filePrefix: 'thumb_m_',
                width: 1200,
                height: 630
              }
            ]
          }
        }
      }
    }
  }
};
