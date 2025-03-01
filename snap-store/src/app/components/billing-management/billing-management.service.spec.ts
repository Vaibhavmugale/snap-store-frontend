import { TestBed } from '@angular/core/testing';

import { BillingManagementService } from './billing-management.service';

describe('BillingManagementService', () => {
  let service: BillingManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
