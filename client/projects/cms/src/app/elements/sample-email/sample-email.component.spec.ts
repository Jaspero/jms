import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleEmailComponent } from './sample-email.component';

describe('SampleEmailComponent', () => {
  let component: SampleEmailComponent;
  let fixture: ComponentFixture<SampleEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
