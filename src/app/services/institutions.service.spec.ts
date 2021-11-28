import { TestBed } from '@angular/core/testing';

import { InstitutionsService } from './institutions.service';

describe('InstitutionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutionsService = TestBed.get(InstitutionsService);
    expect(service).toBeTruthy();
  });
});
