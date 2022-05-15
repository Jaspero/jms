export const COMMON_OPTIONS: {
  properties: {
    [key: string]: {
      type: string
    }
  }
} & any = {
  properties: {
    size: {type: 'string'},
    elementId: {type: 'string'},
    contained: {type: 'boolean'},
    verticalAlignment: {type: 'string'},
    addedClasses: {type: 'array'},
    box: {type: 'object'},
    background: {type: 'string'},
    backgroundSize: {type: 'string'},
    backgroundRepeat: {type: 'boolean'},
    backgroundPosition: {type: 'string'},
    additionalStyle: {type: 'string'}
  },
  segment: [
    {
      type: 'accordion',
      title: 'Settings',
      icon: 'settings',
      configuration: [
        {
          title: 'STANDARD_OPTIONS',
          fields: [
            '/box',
            '/size',
            '/verticalAlignment',
            '/background',
            '/contained'
          ]
        },
        {
          title: 'ADVANCED_OPTIONS',
          fields: [
            '/addedClasses',
            '/elementId',
            '/additionalStyle'
          ]
        },
      ]
    }
  ],
  definitions: {
    size: {
      label: 'SIZE',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'SMALL', value: 'small'},
            {name: 'REGULAR', value: 'regular'},
            {name: 'LARGE', value: 'large'},
            {name: 'FULL_SCREEN', value: 'full-screen'},
          ]
        }
      }
    },
    contained: {label: 'CONTAINED'},
    box: {
      component: {
        type: 'pb-mbp',
        configuration: {
          presets: {
            margin: [
              {
                name: 'SMALL',
                sides: {
                  top: {size: 10, unit: 'px'},
                  right: {size: 10, unit: 'px'},
                  left: {size: 10, unit: 'px'},
                  bottom: {size: 10, unit: 'px'},
                }
              },
              {
                name: 'MEDIUM',
                sides: {
                  top: {size: 20, unit: 'px'},
                  right: {size: 20, unit: 'px'},
                  left: {size: 20, unit: 'px'},
                  bottom: {size: 20, unit: 'px'},
                }
              },
              {
                name: 'LARGE',
                sides: {
                  top: {size: 30, unit: 'px'},
                  right: {size: 30, unit: 'px'},
                  left: {size: 30, unit: 'px'},
                  bottom: {size: 30, unit: 'px'},
                }
              }
            ]
          }
        }
      }
    },
    background: {
      label: 'BACKGROUND',
      component: {
        type: 'pb-background'
      }
    },
    addedClasses: {label: 'CUSTOM_CLASS'},
    elementId: {label: 'ELEMENT_ID'},
    verticalAlignment: {
      label: 'VERTICAL_ALIGNMENT',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'CENTER', value: 'center'},
            {name: 'TOP', value: 'top'},
            {name: 'BOTTOM', value: 'bottom'},
          ]
        }
      }
    },
    additionalStyle: {
      label: 'ADDITIONAL_STYLE',
      component: {
        type: 'monaco',
        configuration: {
          options: {
            theme: 'vs-dark',
            language: 'css',
            minimap: {
              enabled: false
            },
            folding: false,
            glyphMargin: false,
            lineNumbers: 'off',
            activityBar: {
              visible: false
            },
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0
          }
        }
      }
    }
  },
  defaults: {
    size: 'regular',
    contained: true,
    verticalAlignment: 'center',
    additionalStyle: '',
    background: '',
    backgroundRepeat: false,
    backgroundSize: 'contain',
    backgroundPosition: 'center'
  }
};
