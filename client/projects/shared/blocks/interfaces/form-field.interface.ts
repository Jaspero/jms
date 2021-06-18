export interface FormField {
  id: string;
  type: string;
  label?: string;
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  added?: any;
  value?: any;
  conditions?: Array<{
    form: string;
    type: string;
    value: string;
  }>;
}
