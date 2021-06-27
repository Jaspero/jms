import {ModuleSubCollection} from './module-sub-collection.interface';

export interface ModuleMetadata {
  subCollections?: ModuleSubCollection[];
  deletedAuthUser?: boolean;

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
