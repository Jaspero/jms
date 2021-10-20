import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateDescriptionComponent } from './email-template-description.component';

describe('EmailTemplateDescriptionComponent', () => {
  let component: EmailTemplateDescriptionComponent;
  let fixture: ComponentFixture<EmailTemplateDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
