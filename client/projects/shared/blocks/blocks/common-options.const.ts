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
    backgroundPosition: {type: 'string'}
  },
  segment: [
    {
      type: 'accordion',
      title: 'Settings',
      icon: 'settings',
      configuration: [
        {
          title: 'PB.FORM.BLOCKS.SHARED.STANDARD_OPTIONS',
          fields: [
            '/box',
            '/size',
            '/verticalAlignment',
            '/background',
            '/contained'
          ]
        },
        {
          title: 'PB.FORM.BLOCKS.SHARED.ADVANCED_OPTIONS',
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
      label: 'PB.FORM.BLOCKS.SHARED.SIZE',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.SIZE_SMALL', value: 'small'},
            {name: 'PB.FORM.BLOCKS.SHARED.SIZE_REGULAR', value: 'regular'},
            {name: 'PB.FORM.BLOCKS.SHARED.SIZE_LARGE', value: 'large'},
            {name: 'PB.FORM.BLOCKS.SHARED.SIZE_FULL_SCREEN', value: 'full-screen'},
          ]
        }
      }
    },
    contained: {label: 'PB.FORM.BLOCKS.SHARED.CONTAINED'},
    box: {
      component: {
        type: 'pb-mbp',
        configuration: {
          presets: {
            margin: [
              {
                name: 'Small',
                sides: {
                  top: {size: 10, unit: 'px'},
                  right: {size: 10, unit: 'px'},
                  left: {size: 10, unit: 'px'},
                  bottom: {size: 10, unit: 'px'},
                }
              },
              {
                name: 'Medium',
                sides: {
                  top: {size: 20, unit: 'px'},
                  right: {size: 20, unit: 'px'},
                  left: {size: 20, unit: 'px'},
                  bottom: {size: 20, unit: 'px'},
                }
              },
              {
                name: 'Large',
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
      label: 'PB.FORM.BLOCKS.SHARED.BACKGROUND',
      component: {
        type: 'pb-background'
      }
    },
    addedClasses: {label: 'PB.FORM.BLOCKS.SHARED.CUSTOM_CLASS'},
    elementId: {label: 'PB.FORM.BLOCKS.SHARED.ELEMENT_ID'},
    verticalAlignment: {
      label: 'PB.FORM.BLOCKS.SHARED.VERTICAL_ALIGNMENT',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.VERTICAL_ALIGNMENT_CENTER', value: 'center'},
            {name: 'PB.FORM.BLOCKS.SHARED.VERTICAL_ALIGNMENT_TOP', value: 'top'},
            {name: 'PB.FORM.BLOCKS.SHARED.VERTICAL_ALIGNMENT_BOTTOM', value: 'bottom'},
          ]
        }
      }
    },
    additionalStyle: {
      label: 'PB.FORM.BLOCKS.SHARED.ADDITIONAL_STYLE',
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
