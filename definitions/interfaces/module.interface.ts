import {State} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {FilterModule} from './filter-module.interface';
import {ImportModule} from './import-module.interface';
import {InstanceSort} from './instance-sort.interface';
import {ModuleInstance} from './module-instance.interface';
import {ModuleLayoutTable} from './module-layout-table.interface';
import {ModuleMetadata} from './module-metadata.interface';
import {ModuleOverview} from './module-overview.interface';
import {SearchModule} from './search-module.interface';
import {SortModule} from './sort-module.interface';
import {FormatMethod} from './format-method.interface';
import {ComponentDefinition} from './component-definition.type';

export interface ModuleLayout {
  icon?: string;
  editTitleKey?: string | ((row: any) => any);
  /**
   * Used when editTitleKey is undefined.
   * Defaults to "-".
   */
  editTitleKeyFallback?: string;
  order?: number;

  /**
   * ID of a document in the collection.
   * If added the dashboard link navigates
   * directly to the provided id.
   */
  directLink?: string;
  sort?: InstanceSort | InstanceSort[];
  pageSize?: number;
  table?: ModuleLayoutTable;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  importModule?: ImportModule;
  searchModule?: SearchModule;
  instance?: ModuleInstance;
  overview?: ModuleOverview;
}

export interface ModuleDefinition {
  component?: ComponentDefinition;
  formatOnSave?: string | FormatMethod;
  formatOnCreate?: string | FormatMethod;
  formatOnEdit?: string | FormatMethod;
  formatOnLoad?: string | FormatMethod;
  label?: string;
  roles?: string[];
  hint?: string;
  defaultValue?: any;
  placeholder?: string;
  onlyOn?: State | string | string[] | State[];
  disableOn?: State | string | string[] | State[];

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

    /**
     * HTML Template for the spotlight result
     */
    template?: string | ((data: any) => string);
  }
}
