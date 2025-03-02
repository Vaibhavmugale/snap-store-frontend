import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConfigrationService } from '../../api-configration/api-configration';

@Injectable({
  providedIn: 'root'
})
export class BillingManagementService implements Resolve<any> {
  private apiUrl: string;
  private billingSubject = new BehaviorSubject<any[]>([]);
  billings$ = this.billingSubject.asObservable();
  userId:number=0;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
    return this.fetchBilling();
  }

  fetchBilling(): Observable<any> {
     return this.http.get<any[]>(`${this.apiUrl}/api/billing/getbilling/${this.userId}`).pipe(
       tap((data) => this.billingSubject.next(data ?? [])),
       catchError((error) => {
         console.error("Error fetching products:", error);
         this.billingSubject.next([]); 
         return of([]); 
       })
     );
   }
 }