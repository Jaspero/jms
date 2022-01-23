import {ChangeDetectorRef, Component, ElementRef, HostBinding} from '@angular/core';
import {BlockData, BlockDataOptions} from '@jaspero/fb-page-builder';

export interface CommonOptions extends BlockDataOptions {
  elementId?: string;
  size?: 'small' | 'regular' | 'large' | 'full-screen';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  contained?: boolean;
  addedClasses?: string[];
}

@Component({
  selector: 'jms-common-block',
  template: ''
})
export class CommonBlockComponent<T extends CommonOptions> extends BlockData<T> {
  constructor(
    public cdr: ChangeDetectorRef,
    public el: ElementRef
  ) {
    super(cdr, el);
  }

  @HostBinding('id')
  get elementId() {
    return this.data.elementId || '';
  }

  get addedClasses() {
    return this.data.addedClasses || [];
  }

  @HostBinding('class')
  get classes() {
    return [
      `b-va-${this.data.verticalAlignment || 'center'}`,
      `b-size-${this.data.size || 'regular'}`,
      ...this.data.contained ? ['contained'] : [],
      ...super.classes
    ];
  }
}
