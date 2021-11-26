import {Component, ElementRef, HostBinding, Input} from '@angular/core';
import {OnChange} from '@jaspero/ng-helpers';
import {background} from '../utils/background';

export interface CommonOptions {
  size?: 'small' | 'regular' | 'large' | 'full-screen';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  paddingT?: '0' | 'xs' | 's' | 'm' | 'l' | 'xl';
  paddingB?: '0' | 'xs' | 's' | 'm' | 'l' | 'xl';
  marginT?: '0' | 'xs' | 's' | 'm' | 'l' | 'xl';
  marginB?: '0' | 'xs' | 's' | 'm' | 'l' | 'xl';
  backgroundRepeat?: boolean;
  backgroundSize?: 'cover' | 'contain';
  background?: string;
  contained?: boolean;
  whiteText?: boolean;
  additionalStyle?: string;
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

  @OnChange(function() {
    this.triggerChange();
  })
  @Input()
  data: CommonOptions;

  styleEl: HTMLStyleElement;
  additionalStyle: string;

  get addedClasses() {
    return [];
  }

  @HostBinding('class')
  get classes() {
    return [
      'block',
      `b-size-${this.data.size || 'regular'}`,
      `b-va-${this.data.verticalAlignment || 'center'}`,
      `p-t-${this.data.paddingT}`,
      `p-b-${this.data.paddingB}`,
      `m-t-${this.data.marginT}`,
      `m-b-${this.data.marginB}`,
      ...this.data.contained ? ['contained'] : [],
      ...this.data.whiteText ? ['white-text'] : [],
      ...this.addedClasses
    ];
  }

  @HostBinding('style')
  get style() {
    const styles: {[key: string]: string} = background(this.data);

    let final = '';

    // tslint:disable-next-line:forin
    for (const key in styles) {
      final += `${key}:${styles[key]};`;
    }

    return final;
  }

  triggerChange() {
    if (
      this.styleEl &&
      (
        !this.data.additionalStyle ||
        (this.additionalStyle !== this.data.additionalStyle)
      )
    ) {
      this.additionalStyle = '';
      this.el.nativeElement.removeChild(this.styleEl);
    }

    if (this.data.additionalStyle) {
      this.styleEl = document.createElement('style');
      this.additionalStyle = this.data.additionalStyle;
      this.styleEl.innerHTML = this.additionalStyle;
      this.el.nativeElement.appendChild(this.styleEl);
    }
  }
}
