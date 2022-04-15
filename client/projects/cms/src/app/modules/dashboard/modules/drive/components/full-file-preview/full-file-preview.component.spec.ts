import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFilePreviewComponent } from './full-file-preview.component';

describe('FullFilePreviewComponent', () => {
  let component: FullFilePreviewComponent;
  let fixture: ComponentFixture<FullFilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullFilePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
