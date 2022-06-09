export interface ModuleInstanceAction {
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
  children?: ModuleInstanceAction[];
}