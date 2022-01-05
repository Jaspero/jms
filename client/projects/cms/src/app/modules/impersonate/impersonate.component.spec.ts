import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonateComponent } from './impersonate.component';

describe('ImpersonateComponent', () => {
  let component: ImpersonateComponent;
  let fixture: ComponentFixture<ImpersonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpersonateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
