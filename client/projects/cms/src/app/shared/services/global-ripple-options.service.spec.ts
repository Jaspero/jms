import { TestBed } from '@angular/core/testing';

import { GlobalRippleOptionsService } from './global-ripple-options.service';

describe('GlobalRippleOptionsService', () => {
  let service: GlobalRippleOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalRippleOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
