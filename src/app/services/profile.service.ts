import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

import { environment } from "../environment/environments";
import { AuthorizationService } from "./auth.service";
import { ProfileResponse } from "../models/Profiles";
import { IconTech } from "../models/IconTechs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) {}

  getMyProfile(): Observable<ProfileResponse> {
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get<ProfileResponse>(
      `${environment.endpoint}${environment.getMyProfile}`,
      { headers }
    );
  }
  getProfileById(id: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${environment.endpoint}${environment.getProfileId.replace(
        "${id}",
        id.toString()
      )}`
    );
  }

  postProfileById(id: number, form: FormData): Observable<ProfileResponse> {
    const headers = this.authService.getAuthorizationHeaders();
    const options = { headers };
    return this.http.put<ProfileResponse>(
      `${environment.endpoint}${environment.updateProfile.replace(
        "${id}",
        id.toString()
      )}`,
      form,
      options
    );
  }

  getAvailableIcons(): Observable<IconTech[]> {
    return this.http
      .get<IconTech[]>(environment.devicons)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
