import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextImageComponent } from './text-image.component';

describe('TextImageComponent', () => {
  let component: TextImageComponent;
  let fixture: ComponentFixture<TextImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
