import {FormField} from './form-field.interface';

export interface Form {
  id: string;
  notify: string;
  success: string;
  error: string;
  createdOn: number;
  name: string;
  fields: FormField[];
}
