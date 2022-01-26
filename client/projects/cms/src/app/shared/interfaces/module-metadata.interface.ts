import {ModuleSubCollection} from './module-sub-collection.interface';

export interface ModuleMetadata {
  subCollections?: ModuleSubCollection[];
  deletedAuthUser?: boolean;

  /**
   * The prefix used in documents.
   * For example setting it to 'or' would generate documents
   * with ids "or-xxx"
   */
  docIdPrefix?: string;
  /**
   * Length of document ids generated for this collection
   */
  docIdSize?: number;

  /**
   * If autoSave is defined the page automatically saves every x milliseconds
   * if the value is set to 0 then the page automatically saves on every change
   */
  autoSave?: number;

  /**
   * Confirmation dialog to confirm page exit if form is edited
   */
  confirmExitOnTouched?: boolean;
  [key: string]: any;
}
