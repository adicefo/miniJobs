import { TestBed } from '@angular/core/testing';

import { ProfilNavigacijaService } from './profil-navigacija.service';

describe('ProfilNavigacijaService', () => {
  let service: ProfilNavigacijaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilNavigacijaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
