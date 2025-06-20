import { Component } from '@angular/core';
import { BillingViewService } from './billing-view.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing-view',
imports: [CommonModule],
  templateUrl: './billing-view.component.html',
  styleUrl: './billing-view.component.css'
})
export class BillingViewComponent {
 billingData:any=[];
 selectedProducts:any=[];
    constructor(
      private createBillingService: BillingViewService,
    ) {
    }

  ngOnInit(): void {
    this.createBillingService.getBillingObservable().subscribe(data => {
        this.billingData = data;
        this.selectedProducts=this.billingData.selectedProducts;
    });
}
}
