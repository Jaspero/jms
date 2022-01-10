/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {FileManagerService} from './file-manager.service';

describe('Service: FileManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileManagerService]
    });
  });

  it('should ...', inject([FileManagerService], (service: FileManagerService) => {
    expect(service).toBeTruthy();
  }));
});
