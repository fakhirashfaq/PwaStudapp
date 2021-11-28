import { TestBed } from '@angular/core/testing';

import { FbStorageService } from './fb-storage.service';

describe('FbStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FbStorageService = TestBed.get(FbStorageService);
    expect(service).toBeTruthy();
  });
});
