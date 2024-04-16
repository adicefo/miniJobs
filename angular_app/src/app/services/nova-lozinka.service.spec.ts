import { TestBed } from '@angular/core/testing';

import { NovaLozinkaService } from './nova-lozinka.service';

describe('NovaLozinkaService', () => {
  let service: NovaLozinkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NovaLozinkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
