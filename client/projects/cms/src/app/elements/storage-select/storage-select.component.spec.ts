import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageSelectComponent } from './storage-select.component';

describe('StorageSelectComponent', () => {
  let component: StorageSelectComponent;
  let fixture: ComponentFixture<StorageSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
