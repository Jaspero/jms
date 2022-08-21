import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUiRendererComponent } from './form-ui-renderer.component';

describe('FormUiRendererComponent', () => {
  let component: FormUiRendererComponent;
  let fixture: ComponentFixture<FormUiRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUiRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUiRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
