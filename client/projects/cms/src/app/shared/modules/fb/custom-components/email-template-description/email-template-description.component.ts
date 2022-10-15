import {Clipboard} from '@angular/cdk/clipboard';
import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CUSTOM_COMPONENT_DATA, CustomComponentData} from '@jaspero/form-builder';

@Component({
  selector: 'jms-email-template-description',
  templateUrl: './email-template-description.component.html',
  styleUrls: ['./email-template-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplateDescriptionComponent implements OnInit {
  constructor(
    @Inject(CUSTOM_COMPONENT_DATA)
    public data: CustomComponentData,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {}

  @ViewChild('previewDialog', {static: true})
  previewDialogTemplate: TemplateRef<any>;

  description: string;
  dynamic: Array<{
    key: string;
    description: string;
  }>;

  ngOnInit() {

    const {description, dynamicValues} = this.data.form.getRawValue();

    this.description = description;
    this.dynamic = Object.entries(dynamicValues).map(([key, value]: [string, string]) => ({
      key: `[[${key}]]`,
      description: value
    }));
  }

  copy(value: string) {
    this.clipboard.copy(value);
    this.snackbar.open(`${value} copied to clipboard.`, 'Dismiss', {
      duration: 3000
    });
  }
}
