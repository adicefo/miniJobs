import { TestBed } from '@angular/core/testing';

import { PosaoPreviewServiceService } from './posao-preview.service.service';

describe('PosaoPreviewServiceService', () => {
  let service: PosaoPreviewServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosaoPreviewServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
