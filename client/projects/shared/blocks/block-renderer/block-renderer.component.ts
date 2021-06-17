import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, ViewContainerRef} from '@angular/core';
import {BLOCKS} from '../blocks.module';

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
  set blocks(blocks: any[]) {
    this.vcr.clear();

    for (const block of (blocks || [])) {
      if (BLOCKS[block.type]) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          BLOCKS[block.type]
        );
        const componentRef = this.vcr.createComponent(componentFactory);
        (componentRef.instance as any).data = block.value;
      }
    }
  }
}
