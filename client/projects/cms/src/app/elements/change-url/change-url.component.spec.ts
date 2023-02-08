import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUrlComponent } from './change-url.component';

describe('ChangeUrlComponent', () => {
  let component: ChangeUrlComponent;
  let fixture: ComponentFixture<ChangeUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
