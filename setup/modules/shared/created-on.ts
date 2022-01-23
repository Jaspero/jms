import {InstanceSort, PipeType} from './module.type';

export const CREATED_ON = {
  sort: {
    active: 'createdOn',
    direction: 'desc'
  } as InstanceSort,
  column: (sortable = true, format?: string) => ({
    key: '/createdOn',
    label: 'GENERAL.DATE',
    pipe: [PipeType.Date],
    ...sortable && {sortable: true},
    ...format && {
      pipeArguments: {
        0: [format]
      }
    }
  }),
  property: {
    createdOn: {type: 'number'}
  } as any,
  definition: (
    id = 'createdOn',
    label = 'GENERAL.CREATED_ON',
    createInitially = true
  ) => ({
    [id]: {
      label,
      ...createInitially && {
        disableOn: 'edit',
        formatOnLoad: '(value) => value || Date.now()',
      },
      component: {
        type: 'date',
        configuration: {
          includeTime: true,
          labelHours: 'GENERAL.HOURS',
          labelMinutes: 'GENERAL.MINUTES',
          format: 'number'
        }
      }
    },
  })
};
