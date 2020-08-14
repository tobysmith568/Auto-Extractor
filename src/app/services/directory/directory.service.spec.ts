import { TestBed } from "@angular/core/testing";

import { DirectoryService } from "./directory.service";

describe("DirectoryService", () => {
  let service: DirectoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
