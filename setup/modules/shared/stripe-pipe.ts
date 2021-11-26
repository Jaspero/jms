export const STRIPE_PIPE = `value => value ? value / 100 : value`;

export const STRIPE_FORMAT = (suffix = '$') => ({
  formatOnSave: '(value) => Math.round(value * 100)',
  formatOnLoad: '(value) => value / 100',
  component: {
    type: 'input',
    configuration: {
      type: 'number',
      suffix: {
        type: 'html',
        value: suffix
      }
    }
  },
});
