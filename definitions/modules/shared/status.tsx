import {PipeType} from '../../enums/pipe-type.enum';
import JSX from '../../jsx.compiler';

export const STATUS = {
  column: {
    key: '/lastUpdatedOn',
    label: 'STATUS',
    pipe: [PipeType.Custom, PipeType.Sanitize],
    pipeArguments: {
      0: v => JSX(<jms-e-release-status updated={v} />)
    }
  },
  definition: {
    lastUpdatedOn: {
      formatOnSave: () => Date.now()
    }
  },
  property: {
    lastUpdatedOn: {type: 'number'}
  }
};
