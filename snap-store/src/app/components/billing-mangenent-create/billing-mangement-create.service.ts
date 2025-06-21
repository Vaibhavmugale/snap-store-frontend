import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BillingMangementCreateService {
  private apiUrl: string;
  private billingData = new BehaviorSubject<any>(null);
  private billingId: string | null = null;


  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService, private router: Router) {
    this.apiUrl = this.apiConfig.apiUrl;
  }


  getBillingObservable(): Observable<any> {
    return this.billingData.asObservable();
  }

  addBilling(billing: any): Observable<any> {
    console.log("Sending billing data:", billing);
    return this.http.post(`${this.apiUrl}/api/billing/add`, billing);
}

}
