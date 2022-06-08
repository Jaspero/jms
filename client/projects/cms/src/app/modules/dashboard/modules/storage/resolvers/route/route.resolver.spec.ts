import { TestBed } from '@angular/core/testing';

import { RouteResolver } from './route.resolver';

describe('RouteResolver', () => {
  let resolver: RouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
