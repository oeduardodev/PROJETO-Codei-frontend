import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  private token: string = localStorage.getItem('authToken') || '';

  getAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('Token ausente');
      return new HttpHeaders(); 
    }
  }
  

  setToken(newToken: string): void {
    this.token = newToken;
    localStorage.setItem('authToken', newToken);
  }

  clearToken(): void {
    this.token = '';
    localStorage.removeItem('authToken');
  }
}

