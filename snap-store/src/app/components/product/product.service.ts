import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConfigrationService } from '../../api-configration/api-configration';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements Resolve<any> {
  private apiUrl: string;
  private productSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productSubject.asObservable();
  userId:number=0;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
   
    return this.fetchProducts();
  }

  fetchProducts(): Observable<any> {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
    return this.http.get<any[]>(`${this.apiUrl}/api/product/getproduct/${this.userId}`).pipe(
      tap((data) => this.productSubject.next(data ?? [])),
      catchError((error) => {
        console.error("Error fetching products:", error);
        this.productSubject.next([]); 
        return of([]); 
      })
    );
  }
  
    
}