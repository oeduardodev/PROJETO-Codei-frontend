import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}api/register`;
  private apiUrlDois = `${this.baseApiUrl}api/login`;
  private apiUrlTres = `${this.baseApiUrl}api/user`;
  constructor(private http: HttpClient) { }

  register(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData);
  }

  login(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrlDois, formData);
  }
  user(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrlTres, { headers });
  }
}
