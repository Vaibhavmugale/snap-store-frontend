import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

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

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.billingId = route.paramMap.get('id');
    console.log(this.billingId)
    return this.getBillingById();
  }


  getBillingById(): Observable<any> {
    if (this.billingId === 'new') {
      this.billingData.next(false);
      return of(false);
    }
    return this.http.get(`${this.apiUrl}/api/billing/getBillingById/${this.billingId}`).pipe(
      tap(data => this.billingData.next(data))
    );
  }

  getBillingObservable(): Observable<any> {
    return this.billingData.asObservable();
  }

  addBilling(billing: any): Observable<any> {
    console.log("Sending billing data:", billing);
    return this.http.post(`${this.apiUrl}/api/billing/add`, billing);
}

}
