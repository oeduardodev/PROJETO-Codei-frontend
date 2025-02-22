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
  getProfileById(id:number):Observable<any>{
    return this.http.get(`${environment.endpoint}${environment.getProfileId.replace('${id}', id.toString())}`)
  }

  postProfileById(id: number, profile: Profile): Observable<any> {
    const headers = this.authService.getAuthorizationHeaders();
    const options = { headers }; 
    return this.http.put(
      `${environment.endpoint}${environment.updateProfile.replace('${id}', id.toString())}`,
      profile, 
      options 
    );
  }
  
}
