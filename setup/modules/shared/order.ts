export const ORDER = {
  property: {
    order: {
      type: 'number'
    }
  },
  layout: (sortTitle = 'title') => ({
    sort: {
      active: 'order',
      direction: 'asc'
    },
    sortModule: {
      sortKey: 'order',
      sortTitle
    },
  })
};
