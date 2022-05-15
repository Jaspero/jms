import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Router} from '@angular/router';
import {safeEval, safeJsonParse} from '@jaspero/utils';
import {Element} from '../element.decorator';

/**
 * When using the data input you'll need to encode the input since it's going through html
 * window.btoa(encodeURIComponent(JSON.stringify(data)))
 */

 @Element()
@Component({
  selector: 'jms-new-prepopulate',
  templateUrl: './new-prepopulate.component.html',
  styleUrls: ['./new-prepopulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPrepopulateComponent {
  constructor(
    private el: ElementRef,
    private router: Router
  ) {}

  @Input() icon: string;
  @Input() data: string;
  @Input() collection: string;
  @Input() method: () => any;

  prepopulate() {
    const url = `/m/${this.collection}`;

    let data: any;

    if (this.method) {
      data = safeEval(this.method)();
    } else if (this.data) {
      data = safeJsonParse(decodeURIComponent(window.atob(this.data)));
    } else {
      const camelize = s => s.replace(/-./g, x => x.toUpperCase()[1]);
      const {dataset} = this.el.nativeElement;
      data = Object.keys(dataset).reduce((d, key) => {
        d[camelize(key)] = dataset[key];
        return d;
      }, {});
    }

    return this.router.navigate([url], {state: {data}});
  }
}
