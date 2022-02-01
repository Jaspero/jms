import {PipeType} from './module.type'

const method = it => it ? 'GENERAL.YES' : 'GENERAL.NO';

export const YES_NO_PIPE = {
	pipe: [PipeType.Custom, PipeType.Transloco],
	pipeArguments: {
		0: method
	}
}

export const YES_NO_FILTER_PIPE = {
	filterValuePipe: [PipeType.Custom, PipeType.Transloco],
	filterValuePipeArguments: {
		0: method
	}
}