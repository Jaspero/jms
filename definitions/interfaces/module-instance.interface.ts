import {Segment} from '@jaspero/form-builder';
import {FormatMethod} from './format-method.interface';
import {ModuleInstanceAction} from './module-instance-action.interface';

export interface ModuleInstance {

  /**
   * Receives the final results of the form
   * and should return what ever should be saved
   * on the document
   * (data: any) => any;
   */
  formatOnSave?: string | FormatMethod;
  formatOnCreate?: string | FormatMethod;
  formatOnEdit?: string | FormatMethod;

  /**
   * (form: FormGroup) => void;
   */
  formatOnLoad?: string | FormatMethod;
  segments: Segment[];
  actions?: ModuleInstanceAction[];
  service?: string;
}
