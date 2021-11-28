import { TestBed } from '@angular/core/testing';

import { DiscountResolverService } from './discount-resolver.service';

describe('DiscountResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscountResolverService = TestBed.get(DiscountResolverService);
    expect(service).toBeTruthy();
  });
});
