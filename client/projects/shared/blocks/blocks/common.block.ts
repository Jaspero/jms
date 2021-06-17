import {Component, ElementRef, HostBinding, Input} from '@angular/core';

export interface CommonOptions {
  verticalAlignment?: 'top' | 'center' | 'bottom';
}

@Component({
  selector: 'jms-common-block',
  template: ''
})
export class CommonBlockComponent {
  constructor(
    public el: ElementRef
  ) {
  }

  @Input()
  data: CommonOptions;

  @HostBinding('class')
  get classes() {
    return [
      'block',
      `b-va-${this.data.verticalAlignment || 'center'}`
    ];
  }
}
