import {PipeType} from '../../enums/pipe-type.enum';

export const EMAIL_PIPE = {
  pipe: [PipeType.Custom],
  pipeArguments: {
    0: (v: string) => `<a href="mailto:${v}" class="link">${v}</a>`
  }
};
