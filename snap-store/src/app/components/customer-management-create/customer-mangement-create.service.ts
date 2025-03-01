import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerMangementCreateService {
private apiUrl: string;
  private customerData = new BehaviorSubject<any>(null);
  private customerId: string | null = null;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService, private router: Router) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.customerId = route.paramMap.get('id');
    return this.getCustomerById();
  }


  getCustomerById(): Observable<any> {
    if (this.customerId === 'new') {
      this.customerData.next(false);
      return of(false);
    }
    return this.http.get(`${this.apiUrl}/api/customer/getCustomerById/${this.customerId}`).pipe(
      tap(data => this.customerData.next(data))
    );
  }

  getCustomerObservable(): Observable<any> {
    return this.customerData.asObservable();
  }

  addCustomer(customer: any): Observable<any> {
    console.log("Sending customer data:", customer);
    return this.http.post(`${this.apiUrl}/api/customer/add`, customer);
}

}