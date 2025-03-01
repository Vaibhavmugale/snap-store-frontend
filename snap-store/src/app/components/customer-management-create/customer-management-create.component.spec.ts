import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagementCreateComponent } from './customer-management-create.component';

describe('CustomerManagementCreateComponent', () => {
  let component: CustomerManagementCreateComponent;
  let fixture: ComponentFixture<CustomerManagementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerManagementCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
