import { TestBed } from '@angular/core/testing';

import { GerenciamentoUserService } from './gerenciamento-user.service';

describe('GerenciamentoUserService', () => {
  let service: GerenciamentoUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerenciamentoUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
