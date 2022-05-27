import {Component, ElementRef, Input} from '@angular/core';
import {of, from} from 'rxjs';

@Component({
  selector: 'jpe-submit-button',
  template: `<button type="submit" [jpLoadClick]="submit()">{{label}}</button>`,
  styles: [``]
})
export class SubmitButtonComponent {
  constructor(
    private el: ElementRef
  ) {}

  @Input() label = 'Submit';
  
  submit() {
    return () => {

      const form = this.el.nativeElement.closest('form');

      if (!form.reportValidity()) {
        return of(true);
      }

      const data = new FormData(form);
      const typeMap = {
        string: 'stringValue',
        number: 'doubleValue'
      };
      const fields = {
        createdOn: {
          integerValue: Date.now().toString()
        }
      };

      data.forEach((value, key) => {
        fields[key] = {
          [typeMap[typeof value]]: value
        };
      });

      return from(fetch(
        `https://firestore.googleapis.com/v1/projects/jaspero-jms/databases/(default)/documents/inquiries`,
        {
          method: 'POST',
          body: JSON.stringify({fields})
        }
      ));
    };
  }
}
