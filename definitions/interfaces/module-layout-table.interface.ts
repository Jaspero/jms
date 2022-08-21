import {FilterMethod} from '../enums/filter-method.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ModuleInstanceAction} from './module-instance-action.interface';

export interface ModuleLayoutTableColumn {
  /**
   * This flags indicates that the column
   * should be turned in to a form control
   * if it's applied the key property needs
   * to be a string
   */
  control?: boolean;

  key: string | string[];
  label?: string;
  pipe?: PipeType | PipeType[];
  pipeArguments?: any | {[key: string]: any};
  sortable?: boolean;
  join?: string;
  tooltip?: string | ((data: any) => any);
  tooltipFunction?: boolean;
  nestedColumns?: ModuleLayoutTableNestedColumn[];
  authorization?: string[];
  disabled?: boolean;

  /**
   * This value is shown when the key doesn't
   * exist in the row
   */
  fallback?: string;
  /**
   * Either ID or lookup need to be specified
   */
  populate?: {
    collection: string;

    /**
     * If no id is provided the value of column.key
     * is used instead
     */
    id?: string;

    /**
     * If a lookup is provided then the id isn't used
     */
    lookUp?: {
      key: string;
      operator: FilterMethod;
    };

    /**
     * What key from the document to display
     * defaults to name
     */
    displayKey?: string;

    /**
     * What to show when a matching document isn't found
     * defaults to '-'
     */
    fallback?: string;
  };

  /**
   * Resolves Observable-like objects before passing value to next pipe
   */
  resolveObservables?: boolean;
}

export interface ModuleLayoutTableNestedColumn extends ModuleLayoutTableColumn {
  showLabel?: boolean;
}

export interface ModuleLayoutTableSelectionAction {
  /**
   * item => web element
   */
  value: string | Function;
  authorization?: string[];

  /**
   * Doesn't render the action if the criteria isn't satisfied
   * row => boolean
   */
  criteria?: string;
  menuStyle?: boolean;
  children?: ModuleLayoutTableSelectionAction[];
}

export interface ModuleLayoutTable {
  tableColumns?: ModuleLayoutTableColumn[];
  hideAdd?: string[] | boolean;
  hideCheckbox?: string[] | boolean;
  hideEdit?: string[] | boolean;
  hideDelete?: string[] | boolean;
  hideExport?: string[] | boolean;
  hideImport?: string[] | boolean;
  /**
   * @description use `module.layout.instance.actions` instead. This will be deleted in the future
   */
  actions?: ModuleInstanceAction[];
  selectionActions?: ModuleLayoutTableSelectionAction[];

  /**
   * True by default
   */
  stickyHeader?: boolean;
}
