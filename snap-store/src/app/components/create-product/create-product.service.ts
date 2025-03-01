import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {
  private apiUrl: string;
  private productData = new BehaviorSubject<any>(null); // Store product data
  private productId: string | null = null;


  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService, private router: Router) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.productId = route.paramMap.get('id');
    return this.getProductById();
  }


  getProductById(): Observable<any> {
    if (this.productId === 'new') {
      this.productData.next(false);
      return of(false);
    }
    return this.http.get(`${this.apiUrl}/api/product/getProductById/${this.productId}`).pipe(
      tap(data => this.productData.next(data))
    );
  }

  getProductObservable(): Observable<any> {
    return this.productData.asObservable();
  }

  addProduct(product: any): Observable<any> {
    console.log("Sending product data:", product);
    return this.http.post(`${this.apiUrl}/api/product/add`, product);
}

}
