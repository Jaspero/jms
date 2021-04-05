import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishSignUpComponent } from './finish-sign-up.component';

describe('FinishSignUpComponent', () => {
  let component: FinishSignUpComponent;
  let fixture: ComponentFixture<FinishSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
