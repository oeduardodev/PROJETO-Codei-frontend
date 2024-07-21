import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environment/environments';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}api/register`;

  constructor(private http: HttpClient) { }

  register(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData)
  }
}