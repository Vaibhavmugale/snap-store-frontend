import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiConfigrationService } from '../../api-configration/api-configration';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements Resolve<any> {
  private apiUrl: string;
  private userSubject = new BehaviorSubject<any[]>([]);
  users$ = this.userSubject.asObservable();
  userId:any;
  usertype:number=0;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.usertype = User?.usertype;
      if(this.usertype===0){
        this.userId = User?.id;
        return this.getUserById(this.userId);
      }
      
    }
    return this.fetchProducts();
  }

  getUserById(userId: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user/getUserById/${userId}`).pipe(
      tap((data) => {
        this.userSubject.next(Array.isArray(data) ? data : [data]);
      })
    );
  }  

  fetchProducts(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/api/user/getuser`).pipe(
      tap((data) => this.userSubject.next(data))
    );
  }
}
