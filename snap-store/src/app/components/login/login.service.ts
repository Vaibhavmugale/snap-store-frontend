
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  
  
}
