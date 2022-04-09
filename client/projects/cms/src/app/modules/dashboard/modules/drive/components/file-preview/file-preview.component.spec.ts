import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewComponent } from './file-preview.component';

describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
