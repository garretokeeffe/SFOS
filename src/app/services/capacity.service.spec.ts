import { TestBed } from '@angular/core/testing';

import { CapacityService } from './capacity.service';

describe('CapacityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CapacityService = TestBed.get(CapacityService);
    expect(service).toBeTruthy();
  });
});
