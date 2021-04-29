import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerSelectComponent } from './file-manager-select.component';

describe('FileManagerSelectComponent', () => {
  let component: FileManagerSelectComponent;
  let fixture: ComponentFixture<FileManagerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
