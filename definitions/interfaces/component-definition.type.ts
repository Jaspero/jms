import {FieldDefinitions as MatFieldDefinitions} from '@jaspero/fb-fields-mat';
import {FieldDefinitions as PbFieldDefinitions} from '@jaspero/fb-page-builder';
import {TemplateEditorDefinition, TinymceDefinition} from '@jaspero/fb-tinymce';
import {FieldsDefinition} from '@jaspero/fb-form-ui';
import {MonacoDefinition} from '@jaspero/fb-monaco-editor';

/**
 * NOTE(Adding Fields):
 * Any newly registered field modules
 * need to be included here
 */
export type ComponentDefinition = MatFieldDefinitions<''> | MonacoDefinition | TinymceDefinition | FieldsDefinition | PbFieldDefinitions | TemplateEditorDefinition;