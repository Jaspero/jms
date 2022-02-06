import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Router} from '@angular/router';
import {safeJsonParse} from '@jaspero/utils';

/**
 * When using the data input you'll need to encode the input since it's going through html
 * window.btoa(encodeURIComponent(JSON.stringify(data)))
 */
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

  @Input() docId: string;
  @Input() subCollection: string;
  @Input() icon: string;
  @Input() data: string;
  @Input() collection: string;
  @Input() method: () => any;

  prepopulate() {
    const url = (this.docId && this.subCollection)
      ? `/m/${this.collection}/${this.docId}/${this.subCollection}/single/new`
      : `/m/${this.collection}/single/new`;

    let data: any;

    if (this.method) {
      data = this.method();
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
