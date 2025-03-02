import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService implements Resolve<any> {  
  private apiUrl: string;
  private userData = new BehaviorSubject<any>(null);
  userId:any;
  usertype:number=0;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = `${this.apiConfig.apiUrl}/api`;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.userId = route.paramMap.get('id'); 
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.usertype = User?.usertype;
      if(this.usertype===0){
        this.userId = User?.id;
      }
      
    }
    return this.getUserById(this.userId);
  }

  getUserById(userId: string | null): Observable<any> {
    if (userId === 'new') {
      this.userData.next(false);
      return of(false);
    }

    return this.http.get(`${this.apiUrl}/user/getUserById/${userId}`).pipe(
      tap(data => this.userData.next(data))
    );
  }

  addUser(user: any): Observable<any> {
    if (this.userId  === 'new') {
      user.isEdited=0;
    }else{
      user.isEdited=1;
    }
    
    return this.http.post(`${this.apiUrl}/user/adduser`, user);
  }

  getUserObservable(): Observable<any> {
    return this.userData.asObservable();
  }
}

