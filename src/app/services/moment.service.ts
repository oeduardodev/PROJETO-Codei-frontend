import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../environment/environments";

import { Moment } from "../models/Moments";
import { Response } from "../models/Response";

@Injectable({
  providedIn: "root",
})
export class MomentService {
  constructor(private http: HttpClient) {}

  getMoments(): Observable<Response<Moment[]>> {
    return this.http.get<Response<Moment[]>>(
      environment.endpoint + environment.moments
    );
  }

  getMoment(id: number): Observable<Response<Moment>> {
    return this.http.get<Response<Moment>>(
      `${environment.endpoint}${environment.moments}/${id}`
    );
  }

  createMoment(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(
      environment.endpoint + environment.moments,
      formData
    );
  }

  removeMoment(id: number) {
    return this.http.delete(
      `${environment.endpoint}${environment.moments}/${id}`
    );
  }

  updateMoment(id: number, formData: FormData) {
    return this.http.put<FormData>(
      `${environment.endpoint}${environment.moments}/${id}`,
      formData
    );
  }
}
