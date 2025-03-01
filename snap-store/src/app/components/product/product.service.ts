import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiConfigrationService } from '../../api-configration/api-configration';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements Resolve<any> {
  private apiUrl: string;
  private productSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productSubject.asObservable();

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.fetchProducts();
  }

  fetchProducts(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/api/product/getproduct`).pipe(
      tap((data) => this.productSubject.next(data))
    );
  }
 
}
