import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTextComponent } from './media-text.component';

describe('MediaTextComponent', () => {
  let component: MediaTextComponent;
  let fixture: ComponentFixture<MediaTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
