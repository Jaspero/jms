import {PipeType} from '../../enums/pipe-type.enum';
import {InstanceSort} from '../../interfaces/instance-sort.interface';

export const CREATED_ON = {
  sort: {
    active: 'createdOn',
    direction: 'desc'
  } as InstanceSort,
  column: (sortable = true, format?: string) => ({
    key: '/createdOn',
    label: 'DATE',
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
    label = 'CREATED_ON',
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
          labelHours: 'HOURS',
          labelMinutes: 'MINUTES',
          format: 'number'
        }
      }
    },
  })
};
