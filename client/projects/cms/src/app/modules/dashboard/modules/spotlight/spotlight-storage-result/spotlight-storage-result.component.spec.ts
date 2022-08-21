import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightStorageResultComponent } from './spotlight-storage-result.component';

describe('SpotlightStorageResultComponent', () => {
  let component: SpotlightStorageResultComponent;
  let fixture: ComponentFixture<SpotlightStorageResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotlightStorageResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightStorageResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
