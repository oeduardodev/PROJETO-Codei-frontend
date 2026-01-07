import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

import { environment } from "../environment/environments";
import { AuthorizationService } from "./auth.service";
import { ProfileResponse } from "../models/Profiles";
import { IconTech } from "../models/IconTechs";
import { NotificationUser } from "../models/Notifications";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) {}

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${environment.endpoint}${environment.getMyProfile}`
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
    return this.http.put<ProfileResponse>(
      `${environment.endpoint}${environment.updateProfile.replace(
        "${id}",
        id.toString()
      )}`,
      form
    );
  }

  getAvailableIcons(): Observable<IconTech[]> {
    return this.http
      .get<IconTech[]>(environment.devicons, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  getNotifications(): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(
      `${environment.endpoint}${environment.notifications}`
    );
  }

  clearNotifications(notificationId: number): Observable<NotificationUser[]> {
    return this.http.post<NotificationUser[]>(
      `${environment.endpoint}${environment.notifications}`,
      { id: notificationId }
    );
  }
}
