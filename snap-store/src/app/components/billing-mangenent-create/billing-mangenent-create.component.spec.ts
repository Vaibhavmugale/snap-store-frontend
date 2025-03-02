import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingMangenentCreateComponent } from './billing-mangenent-create.component';

describe('BillingMangenentCreateComponent', () => {
  let component: BillingMangenentCreateComponent;
  let fixture: ComponentFixture<BillingMangenentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingMangenentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingMangenentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
