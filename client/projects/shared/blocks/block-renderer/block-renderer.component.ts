import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, ViewContainerRef} from '@angular/core';
import {STATE} from '@jaspero/fb-page-builder';

@Component({
  selector: 'jms-block-renderer',
  templateUrl: './block-renderer.component.html',
  styleUrls: ['./block-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockRendererComponent {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private vcr: ViewContainerRef
  ) {}

  @Input()
  module: string;

  @Input()
  set blocks(blocks: any[]) {
    this.vcr.clear();

    const bDefs = Object.values(STATE.blocks[this.module]);

    for (const block of (blocks || [])) {
      const def = bDefs.find(it => it.id === block.type);
      if (def) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          def.component
        );
        const componentRef = this.vcr.createComponent(componentFactory);
        (componentRef.instance as any).data = block.value;
      }
    }
  }
}
