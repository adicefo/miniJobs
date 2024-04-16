import { TestBed } from '@angular/core/testing';

import { PrivremeniAuthService } from './privremeni-auth.service';

describe('PrivremeniAuthService', () => {
  let service: PrivremeniAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivremeniAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
