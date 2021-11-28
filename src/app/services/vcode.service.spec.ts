import { TestBed } from '@angular/core/testing';

import { VcodeService } from './vcode.service';

describe('VcodeService', () => {
  let service: VcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
