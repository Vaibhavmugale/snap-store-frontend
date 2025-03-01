import { TestBed } from '@angular/core/testing';

import { CustomerMangementCreateService } from './customer-mangement-create.service';

describe('CustomerMangementCreateService', () => {
  let service: CustomerMangementCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerMangementCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
