import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {Router} from '@angular/router';
import {Element} from '../element.decorator';

@Element()
@Component({
  selector: 'jms-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  constructor(
    private router: Router
  ) {}

  @Input()
  link: string;

  @Input()
  icon = 'arrow_forward';

  open() {
    this.router.navigateByUrl(this.link);
  }
}
