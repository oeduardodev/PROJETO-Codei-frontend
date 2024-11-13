import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environments';

import { Moment } from '../models/Moments';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root'
})
export class MomentService {


  constructor(private http: HttpClient) { }

  getMoments(): Observable<Response<Moment[]>> {
    return this.http.get<Response<Moment[]>>(environment.endpoint + environment.moments);
  }

  getMoment(id: Number): Observable<Response<Moment>> {
    return this.http.get<Response<Moment>>(`${environment.endpoint}${environment.moments}/${id}`);
  }

  createMoment(formData: FormData): Observable<FormData> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<FormData>((environment.endpoint + environment.moments), formData, { headers });
  }

  removeMoment(id: Number) {
    return this.http.delete(`${environment.endpoint}${environment.moments}/${id}`);
  }

  updateMoment(id: Number, formData: FormData) {
    return this.http.put<FormData>(`${environment.endpoint}${environment.moments}/${id}`, formData);
  }
}
