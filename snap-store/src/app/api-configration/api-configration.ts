import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigrationService {
  public apiUrl = 'http://localhost:8080';
}
