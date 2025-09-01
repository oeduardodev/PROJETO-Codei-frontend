import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environments';
import { AuthorizationService } from './auth.service';
import { Credencial } from '../models/Credencials';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) { }

  register(formData: FormData): Observable<Credencial> {
    return this.http.post<Credencial>(
      environment.endpoint + environment.register,
      formData
    );
  }

  login(formData: FormData): Observable<Credencial> {
    return this.http.post<Credencial>(
      environment.endpoint + environment.login,
      formData
    );
  }

  getUser(): Observable<User> {
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get<User>(environment.endpoint + environment.getUser, { headers });
  }  
}
