import { TestBed } from '@angular/core/testing';

import { PirataResolver } from './pirata.resolver';

describe('PirataResolver', () => {
  let resolver: PirataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PirataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
