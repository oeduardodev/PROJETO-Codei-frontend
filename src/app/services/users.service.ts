import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(private http: HttpClient) { }

  register(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(environment.endpoint + environment.register, formData);
  }

  login(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(environment.endpoint + environment.login, formData);
  }
  user(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(environment.endpoint + environment.getUser, { headers });
  }
}
