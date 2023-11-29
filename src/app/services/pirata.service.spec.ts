import { TestBed } from '@angular/core/testing';

import { PirataService } from './pirata.service';

describe('PirataService', () => {
  let service: PirataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PirataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
