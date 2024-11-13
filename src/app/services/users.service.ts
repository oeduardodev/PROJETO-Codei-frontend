import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environments';
import { AuthorizationService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) { }

  register(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(environment.endpoint + environment.register, formData);
  }

  login(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(environment.endpoint + environment.login, formData);
  }

  getUser(headers: HttpHeaders): Observable<any> {
    return this.http.get(environment.endpoint + environment.getUser, { headers });
  }  
}
