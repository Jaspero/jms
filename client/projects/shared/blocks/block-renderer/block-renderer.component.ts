import {ChangeDetectionStrategy, Component, Input, Output, ViewContainerRef, EventEmitter} from '@angular/core';
import {STATE} from '@jaspero/fb-page-builder';
import {combineLatest, filter, take} from 'rxjs';
import {CommonBlockComponent} from '../blocks/common.block';

@Component({
  selector: 'jms-block-renderer',
  templateUrl: './block-renderer.component.html',
  styleUrls: ['./block-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockRendererComponent {
  constructor(
    private vcr: ViewContainerRef
  ) {}

  @Input()
  module: string;

  @Output()
  loaded = new EventEmitter();

  @Input()
  set blocks(blocks: any[]) {
    this.vcr.clear();

    const bDefs = Object.entries(STATE.blocks[this.module])
      .map(([id, data]) => ({id, ...data}));
    const loaders = [];

    for (const block of (blocks || [])) {
      const def = bDefs.find(it => it.id === block.type);
      if (def) {
        const componentRef = this.vcr.createComponent<CommonBlockComponent>(def.component);

        Object.defineProperty(componentRef.instance, 'data', {
          value: block.value
        });

        loaders.push(componentRef.instance.loaded$);
      }
    }

    combineLatest(loaders)
      .pipe(
        filter(loaders =>
          !loaders.some(loader => !loader)
        ),
        take(1)
      )
      .subscribe(() =>
        this.loaded.emit(true)
      )
  }
}
