import { TestBed } from "@angular/core/testing";

import { BuddyService } from "./buddy.service";

describe("BuddyService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: BuddyService = TestBed.get(BuddyService);
    expect(service).toBeTruthy();
  });
});
