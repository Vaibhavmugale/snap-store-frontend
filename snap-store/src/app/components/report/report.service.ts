import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigrationService } from '../../api-configration/api-configration';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
 private apiUrl: string;

  constructor(private http: HttpClient, private apiConfig: ApiConfigrationService) {
    this.apiUrl = this.apiConfig.apiUrl;
  }

  generateReport(report: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/billing/generateReport`, report);
}

}
