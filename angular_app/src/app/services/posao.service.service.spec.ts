import { TestBed } from '@angular/core/testing';

import { PosaoServiceService } from './posao.service.service';

describe('PosaoServiceService', () => {
  let service: PosaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
