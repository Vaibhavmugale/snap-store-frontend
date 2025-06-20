import { TestBed } from '@angular/core/testing';

import { BillingViewService } from './billing-view.service';

describe('BillingViewService', () => {
  let service: BillingViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
