import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environments';

import { Moment } from '../Moments';

@Injectable({
  providedIn: 'root'
})

export class MomentService {

  private BaseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.BaseApiUrl}api/moments`

  constructor(private http: HttpClient) { }
  
  createMoment(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData)
  }
}
