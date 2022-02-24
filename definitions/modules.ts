// @ts-ignore
declare global {
  interface Window {
    jms: {
      util: any
    };
  }
}

 export * from '../setup/modules/modules';

 /**
	* Types
	*/
	export type {Module} from '../client/projects/cms/src/app/shared/interfaces/module.interface';
	export type {SortModule} from '../client/projects/cms/src/app/shared/interfaces/sort-module.interface';
	export type {InstanceSort} from '../client/projects/cms/src/app/shared/interfaces/instance-sort.interface';
	
	export {PipeType} from '../client/projects/cms/src/app/shared/enums/pipe-type.enum';
	export {FilterMethod} from '../client/projects/cms/src/app/shared/enums/filter-method.enum';