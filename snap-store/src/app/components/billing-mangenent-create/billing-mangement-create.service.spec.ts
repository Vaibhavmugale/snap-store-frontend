import { TestBed } from '@angular/core/testing';

import { BillingMangementCreateService } from './billing-mangement-create.service';

describe('BillingMangementCreateService', () => {
  let service: BillingMangementCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingMangementCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
