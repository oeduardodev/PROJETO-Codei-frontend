import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environments';

import { Moment } from '../Moments';
import { Response } from '../Response';

@Injectable({
  providedIn: 'root'
})

export class MomentService {

  private BaseApiUrl = environment.baseApiUrl
  private apiUrl = `${this.BaseApiUrl}api/moments`

  constructor(private http: HttpClient) { }

  getMoments(): Observable<Response<Moment[]>> {
    return this.http.get<Response<Moment[]>>(this.apiUrl);
  }

  getMoment(id: Number): Observable<Response<Moment>> {
    const url = `${this.apiUrl}/${id}`
    return this.http.get<Response<Moment>>(url)
  }

  createMoment(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData)
  }

  removeMoment(id: Number) {
    const url = `${this.apiUrl}/${id}`
    return this.http.delete(url)
  }
}
