import { TestBed } from '@angular/core/testing';

import { ConfirmExitGuard } from './confirm-exit.guard';

describe('ConfirmExitGuard', () => {
  let guard: ConfirmExitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfirmExitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
