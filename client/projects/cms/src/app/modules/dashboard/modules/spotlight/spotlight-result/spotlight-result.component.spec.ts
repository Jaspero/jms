import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightResultComponent } from './spotlight-result.component';

describe('SpotlightResultComponent', () => {
  let component: SpotlightResultComponent;
  let fixture: ComponentFixture<SpotlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
