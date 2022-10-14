declare global {
  interface Window {
    jms: {
      util: any;
    };
  }
}

export * from './modules/modules';
export * from './interfaces/collections/collections';

/**
 * Types
 */
export type {ComponentDefinition} from './interfaces/component-definition.type';
export type {FilterModule} from './interfaces/filter-module.interface';
export type {FormatMethod} from './interfaces/format-method.interface';
export type {ImportModule} from './interfaces/import-module.interface';
export type {InstanceSort} from './interfaces/instance-sort.interface';
export type {ModuleInstance} from './interfaces/module-instance.interface';
export type {ModuleInstanceAction} from './interfaces/module-instance-action.interface';
export type {ModuleLayoutTable} from './interfaces/module-layout-table.interface';
export type {ModuleMetadata} from './interfaces/module-metadata.interface';
export type {ModuleOverviewView} from './interfaces/module-overview-view.interface';
export type {ModuleOverview} from './interfaces/module-overview.interface';
export type {ModuleSubCollection} from './interfaces/module-sub-collection.interface';
export type {ModuleDeleteCollection} from './interfaces/module-delete-collection.interface';
export type {Module} from './interfaces/module.interface';
export type {SearchModule} from './interfaces/search-module.interface';
export type {SortModule} from './interfaces/sort-module.interface';
export type {FilterModuleDefinition} from './interfaces/filter-module.interface';
export type {ModuleLayoutTableSelectionAction} from './interfaces/module-layout-table.interface';
export type {ModuleLayoutTableColumn} from './interfaces/module-layout-table.interface';
export type {ModuleDefinitions} from './interfaces/module.interface';
export type {StorageItem} from './interfaces/storage-item.interface';

export {Collections} from './interfaces/collections';

export {PipeType} from './enums/pipe-type.enum';
export {FilterMethod} from './enums/filter-method.enum';
export {EmailTemplates} from './enums/email-templates.enum';

export {SHARED_CONFIG} from './consts/shared-config.const';

export {JSX} from './jsx.compiler';

import {PROCESSED} from './modules/emails/processed.const';

export const EMAIL_LAYOUT = PROCESSED.layout;
export const EMAIL_STYLE = PROCESSED.css;