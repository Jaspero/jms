import {ModuleDeleteCollection} from './module-delete-collection.interface';
import {ModuleSubCollection} from './module-sub-collection.interface';

export interface ModuleMetadata {

  /**
   * Defines if a module has attached files.
   * This defaults to true and only setting `attachedFiles.contains = false`
   * would prevent the delete trigger from attempting
   * to delete attached files
   */
  attachedFiles?: {
    containes?: boolean;

    /**
     * Folder to search for files to delete in.
     * Defaults to "/". Can also contain dynamic {{documentId}} and
     * {{moduleId}} macros.
     */
    prefix?: string;
  };

  /**
   * Collections and sub collections that should be deleted
   * when the document is deleted.
   */
  collections?: ModuleDeleteCollection[];
  subCollections?: ModuleSubCollection[];

  /**
   * When set to true attempts to delete an auth user
   * with the same id of the deleted document
   */
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
   * Method for generating document ID.  "docIdPrefix" and "docIdSize"
   * are ignored if this is supplied.
   */
  docIdMethod?: <T = any>(data: T) => string;

  /**
   * If autoSave is defined the page automatically saves every x milliseconds
   * if the value is set to 0 then the page automatically saves on every change
   */
  autoSave?: number;

  /**
   * Confirmation dialog to confirm page exit if form is edited
   */
  confirmExitOnTouched?: boolean;

  /**
   * Generates history entries for the specified collection
   */
  history?: boolean;
  [key: string]: any;
}
