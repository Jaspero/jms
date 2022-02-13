export const DYNAMIC_COLLECTIONS = {
  deploymentUrl: 'https://api.github.com/repos/jaspero/jms/actions/workflows/dynamic-pages.workflow.yml/dispatches',
  collections: {
    pages: {
      changes: ['meta', 'title'],
      command: 'build',
      hosting: 'web'
    },
    'pages-hr': {
      changes: ['meta', 'title'],
      command: 'build-hr',
      hosting: 'web-hr'
    }
  }
};
