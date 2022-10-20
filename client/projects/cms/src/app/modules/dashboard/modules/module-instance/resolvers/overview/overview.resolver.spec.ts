import { TestBed } from '@angular/core/testing';

import { OverviewResolver } from './overview.resolver';

describe('OverviewResolver', () => {
  let resolver: OverviewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OverviewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
