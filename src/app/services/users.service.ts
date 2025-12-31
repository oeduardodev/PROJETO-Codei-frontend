// services/users.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../environment/environments";
import { AuthorizationService } from "./auth.service";
import { User } from "../models/User";

interface LoginResponse {
  type: string;
  token: string;
  user?: any;
}

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) {}

  register(formData: FormData): Observable<any> {
    return this.http
      .post(environment.endpoint + environment.register, formData)
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.authService.setToken(response.token);
          }
        })
      );
  }

  login(formData: FormData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(environment.endpoint + environment.login, formData)
      .pipe(
        tap((response: LoginResponse) => {
          console.log("Resposta do login:", response);

          if (response && response.token) {
            this.authService.setToken(response.token);
          } else {
            console.error("Token não encontrado na resposta");
          }
        })
      );
  }

  loggout(): void {
    this.authService.clearToken();
  }

  getUser(): Observable<User> {
    return this.http.get<User>(environment.endpoint + environment.getUser);
  }
}
