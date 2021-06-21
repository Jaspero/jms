import {MatDialogConfig} from '@angular/material/dialog';
import {Segment} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {FilterMethod} from '../enums/filter-method.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ModuleDefinition} from './module.interface';

export interface FilterModuleDefinition extends ModuleDefinition {
  filterMethod?: FilterMethod;
  filterLabel?: string;
  filterKey?: string;
  filterValuePipe?: PipeType | PipeType[];
  filterValuePipeArguments?: any | {[key: string]: any};
}

export interface FilterModuleDefinitions {
  [key: string]: FilterModuleDefinition;
}

export interface FilterModule {
  schema: JSONSchema7;

  /**
   * Method for formatting the WhereFilter[] before
   * forwarding it to the filter handler
   */
  formatOnSubmit?: string;
  value?: any;
  definitions?: FilterModuleDefinitions;
  segments?: Segment[];
  clearFilters?: any;
  clearFiltersLabel?: string;
  dialogOptions?: Partial<MatDialogConfig>;

  /**
   * Hides the dialog for opening filters if true
   * usefully for applying persistent filters to a table
   */
  hidden?: boolean;

  /**
   * Hides the filter list chips above table if true
   */
  hiddenChips?: boolean;

  /**
   * Flags all where filters with the persist value
   */
  persist?: boolean;
}
