import {Segment} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {FilterMethod} from '../enums/filter-method.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ModuleDefinition} from './module.interface';

export interface FilterModuleDefinition extends ModuleDefinition {
  filterMethod?: FilterMethod;
  filterLabel?: string;
  filterKey?: string;
  filterValuePipe?: PipeType | PipeType[];
  filterValuePipeArguments?: any | {[key: string]: any};
}

export interface FilterModuleDefinitions {
  [key: string]: FilterModuleDefinition;
}

export interface FilterModule {
  schema: JSONSchema7;

  /**
   * Method for formatting the WhereFilter[] before
   * forwarding it to the filter handler
   */
  formatOnSubmit?: string;
  value?: any;
  definitions?: FilterModuleDefinitions;
  segments?: Segment[];
  clearFilters?: any;
  clearFiltersLabel?: string;
  dialogOptions?: {
      /** ID for the dialog. If omitted, a unique one will be generated. */
      id?: string;
      /** Custom class for the overlay pane. */
      panelClass?: string | string[];
      /** Whether the dialog has a backdrop. */
      hasBackdrop?: boolean;
      /** Custom class for the backdrop. */
      backdropClass?: string | string[];
      /** Whether the user can use escape or clicking on the backdrop to close the modal. */
      disableClose?: boolean;
      /** Width of the dialog. */
      width?: string;
      /** Height of the dialog. */
      height?: string;
      /** Min-width of the dialog. If a number is provided, assumes pixel units. */
      minWidth?: number | string;
      /** Min-height of the dialog. If a number is provided, assumes pixel units. */
      minHeight?: number | string;
      /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
      maxWidth?: number | string;
      /** Max-height of the dialog. If a number is provided, assumes pixel units. */
      maxHeight?: number | string;
      /** Position overrides. */
      position?: {
        top?: string;
        /** Override for the dialog's bottom position. */
        bottom?: string;
        /** Override for the dialog's left position. */
        left?: string;
        /** Override for the dialog's right position. */
        right?: string;
      };
      /** Layout direction for the dialog's content. */
      direction?: 'ltr' | 'rtl';
      /** ID of the element that describes the dialog. */
      ariaDescribedBy?: string | null;
      /** ID of the element that labels the dialog. */
      ariaLabelledBy?: string | null;
      /** Aria label to assign to the dialog element. */
      ariaLabel?: string | null;
      /**
       * Where the dialog should focus on open.
       */
      autoFocus?: string;
      /**
       * Whether the dialog should restore focus to the
       * previously-focused element, after it's closed.
       */
      restoreFocus?: boolean;
      /**
       * Whether the dialog should close when the user goes backwards/forwards in history.
       * Note that this usually doesn't include clicking on links (unless the user is using
       * the `HashLocationStrategy`).
       */
      closeOnNavigation?: boolean;
  };

  /**
   * Hides the dialog for opening filters if true
   * usefully for applying persistent filters to a table
   */
  hidden?: boolean;

  /**
   * Hides the filter list chips above table if true
   */
  hiddenChips?: boolean;

  /**
   * Flags all where filters with the persist value
   */
  persist?: boolean;
}
