import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseStatusComponent } from './release-status.component';

describe('ReleaseStatusComponent', () => {
  let component: ReleaseStatusComponent;
  let fixture: ComponentFixture<ReleaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
