import {FieldDefinitions as MatFieldDefinitions} from '@jaspero/fb-fields-mat';
import {FieldsDefinition} from '@jaspero/fb-form-ui';
import {MonacoDefinition} from '@jaspero/fb-monaco-editor';
import {FieldDefinitions as PbFieldDefinitions} from '@jaspero/fb-page-builder';
import {TemplateEditorDefinition, TinymceDefinition} from '@jaspero/fb-tinymce';
import {State} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {FilterModule} from './filter-module.interface';
import {ImportModule} from './import-module.interface';
import {InstanceSort} from './instance-sort.interface';
import {ModuleAuthorization} from './module-authorization.interface';
import {ModuleInstance} from './module-instance.interface';
import {ModuleLayoutTable} from './module-layout-table.interface';
import {ModuleMetadata} from './module-metadata.interface';
import {ModuleOverview} from './module-overview.interface';
import {SearchModule} from './search-module.interface';
import {SortModule} from './sort-module.interface';
import {FormatMethod} from './format-method.interface';

export interface ModuleLayout {
  icon?: string;
  editTitleKey?: string;
  order?: number;

  /**
   * ID of a document in the collection.
   * If added the dashboard link navigates
   * directly to the provided id.
   */
  directLink?: string;
  sort?: InstanceSort;
  pageSize?: number;
  table?: ModuleLayoutTable;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  importModule?: ImportModule;
  searchModule?: SearchModule;
  instance?: ModuleInstance;
  overview?: ModuleOverview;
}

export interface ComponentDefinition {
  type: string;
  configuration?: any;
}

export interface ModuleDefinition {
  /**
   * Any newly registered field modules
   * need to be included here
   */
  component?: MatFieldDefinitions<''> | MonacoDefinition | TinymceDefinition | FieldsDefinition | PbFieldDefinitions | TemplateEditorDefinition;
  formatOnSave?: string | FormatMethod;
  formatOnCreate?: string | FormatMethod;
  formatOnEdit?: string | FormatMethod;
  formatOnLoad?: string | FormatMethod;
  label?: string;
  hint?: string;
  defaultValue?: any;
  placeholder?: string;
  onlyOn?: State | string;
  disableOn?: State | string;

  columnsDesktop?: number;
  columnsMobile?: number;
}

export interface ModuleDefinitions {
  [key: string]: ModuleDefinition;
}

export interface Module {
  id: string;
  createdOn?: number;
  name: string;
  order?: number;
  description?: string;
  schema: JSONSchema7;
  layout?: ModuleLayout;
  definitions?: ModuleDefinitions;
  authorization?: ModuleAuthorization;
  metadata?: ModuleMetadata;
  subCollectionPath?: string;
  collectionGroup?: boolean;
  spotlight?: {
    /**
     * Hide Module from showing up in Spotlight results
     */
    hide?: boolean;

    /**
     * Query following properties in Module's documents
     * default ['id', 'name']
     */
    queryFields: string[];
  }
}
