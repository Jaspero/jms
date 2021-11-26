export const COMMON_OPTIONS: {
  properties: {
    [key: string]: {
      type: string
    }
  }
} & any = {
  properties: {
    whiteText: {type: 'boolean'},
    size: {type: 'string'},
    contained: {type: 'boolean'},
    background: {type: 'string'},
    paddingT: {type: 'string'},
    paddingB: {type: 'string'},
    marginT: {type: 'string'},
    marginB: {type: 'string'},
    verticalAlignment: {type: 'string'},
    additionalStyle: {type: 'string'},
    backgroundRepeat: {type: 'boolean'},
    backgroundSize: {type: 'string'},
    customClass: {type: 'string'},
    elementId: {type: 'string'}
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
            '/size',
            '/paddingT',
            '/paddingB',
            '/marginT',
            '/marginB',
            '/verticalAlignment',
            '/background',
            '/whiteText',

            // TODO: Show only when background is url
            '/backgroundRepeat',
            '/backgroundSize',
            '/contained'
          ]
        },
        {
          title: 'PB.FORM.BLOCKS.SHARED.ADVANCED_OPTIONS',
          fields: [
            '/customClass',
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
    paddingT: {
      label: 'PB.FORM.BLOCKS.SHARED.PADDING_TOP',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_NONE', value: '0'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_SMALL', value: 'xs'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_SMALL', value: 's'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_MEDIUM', value: 'm'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_LARGE', value: 'l'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_LARGE', value: 'xl'},
          ]
        }
      }
    },
    paddingB: {
      label: 'PB.FORM.BLOCKS.SHARED.PADDING_BOTTOM',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_NONE', value: '0'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_SMALL', value: 'xs'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_SMALL', value: 's'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_MEDIUM', value: 'm'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_LARGE', value: 'l'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_LARGE', value: 'xl'},
          ]
        }
      }
    },
    marginT: {
      label: 'PB.FORM.BLOCKS.SHARED.MARGIN_TOP',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_NONE', value: '0'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_SMALL', value: 'xs'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_SMALL', value: 's'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_MEDIUM', value: 'm'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_LARGE', value: 'l'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_LARGE', value: 'xl'},
          ]
        }
      }
    },
    marginB: {
      label: 'PB.FORM.BLOCKS.SHARED.MARGIN_BOTTOM',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_NONE', value: '0'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_SMALL', value: 'xs'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_SMALL', value: 's'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_MEDIUM', value: 'm'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_LARGE', value: 'l'},
            {name: 'PB.FORM.BLOCKS.SHARED.SPACING_EXTRA_LARGE', value: 'xl'},
          ]
        }
      }
    },
    whiteText: {label: 'PB.FORM.BLOCKS.SHARED.WHITE_TEXT'},
    contained: {label: 'PB.FORM.BLOCKS.SHARED.CONTAINED'},
    background: {label: 'PB.FORM.BLOCKS.SHARED.BACKGROUND'},
    backgroundRepeat: {label: 'PB.FORM.BLOCKS.SHARED.BACKGROUND_REPEAT'},
    customClass: {label: 'PB.FORM.BLOCKS.SHARED.CUSTOM_CLASS'},
    elementId: {label: 'PB.FORM.BLOCKS.SHARED.ELEMENT_ID'},
    backgroundSize: {
      label: 'PB.FORM.BLOCKS.SHARED.BACKGROUND_SIZE',
      component: {
        type: 'select',
        configuration: {
          dataSet: [
            {name: 'PB.FORM.BLOCKS.SHARED.BACKGROUND_SIZE_COVER', value: 'cover'},
            {name: 'PB.FORM.BLOCKS.SHARED.BACKGROUND_SIZE_CONTAIN', value: 'regular'},
          ]
        }
      }
    },
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
    margin: 'none',
    contained: true,
    backgroundRepeat: false,
    whiteText: false,
    paddingT: '0',
    paddingB: '0',
    marginT: '0',
    marginB: '0',
    verticalAlignment: 'center',
    backgroundSize: 'contain',
    background: '',
    additionalStyle: ''
  }
};
