import {FieldDefinitions as MatFieldDefinitions} from '@jaspero/fb-fields-mat';
import {TinymceDefinition} from '@jaspero/fb-tinymce';
import {FieldDefinitions as PbFieldDefinitions} from '@jaspero/fb-page-builder';
import {DefinitionWithConfiguration, FieldData} from '@jaspero/form-builder';

/**
 * NOTE(Adding Fields):
 * Any newly registered field modules
 * need to be included here
 */
export type ComponentDefinition = MatFieldDefinitions<''> | TinymceDefinition |  PbFieldDefinitions | DefinitionWithConfiguration<FieldData, '', 'permissions'>;