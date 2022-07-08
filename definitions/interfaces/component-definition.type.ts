import {FieldDefinitions as MatFieldDefinitions} from '@jaspero/fb-fields-mat';
import {TinymceDefinition, TemplateEditorDefinition} from '@jaspero/fb-tinymce';

/**
 * NOTE(Adding Fields):
 * Any newly registered field modules
 * need to be included here
 */
export type ComponentDefinition = MatFieldDefinitions<''> | TinymceDefinition | TemplateEditorDefinition;