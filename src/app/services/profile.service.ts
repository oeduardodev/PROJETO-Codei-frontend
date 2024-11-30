import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../environment/environments';
import { Response } from '../models/Response';
import { AuthorizationService } from './auth.service';
import { Profile } from '../models/Profiles';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) { }

  getMyProfile(): Observable<any> {
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get(`${environment.endpoint}${environment.getMyProfile}`, { headers })
  }
  
}
