import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariationsComponent } from './product-variations.component';

describe('ProductVariationsComponent', () => {
  let component: ProductVariationsComponent;
  let fixture: ComponentFixture<ProductVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
