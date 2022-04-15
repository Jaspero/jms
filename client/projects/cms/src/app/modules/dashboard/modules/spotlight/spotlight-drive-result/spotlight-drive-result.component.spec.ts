import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightDriveResultComponent } from './spotlight-drive-result.component';

describe('SpotlightDriveResultComponent', () => {
  let component: SpotlightDriveResultComponent;
  let fixture: ComponentFixture<SpotlightDriveResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotlightDriveResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightDriveResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
