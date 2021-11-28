import { TestBed } from '@angular/core/testing';

import { LikeUnlikeService } from './like-unlike.service';

describe('LikeUnlikeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeUnlikeService = TestBed.get(LikeUnlikeService);
    expect(service).toBeTruthy();
  });
});
