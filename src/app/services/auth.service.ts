// services/auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../environment/environments";

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {
  constructor(private http: HttpClient, private router: Router) {}

  // Método de login que salva o token
  login(credentials: FormData): Observable<any> {
    return this.http.post(`${environment.endpoint}/login`, credentials).pipe(
      tap((response: any) => {
        // Salva o token quando o login for bem-sucedido
        if (response.token) {
          this.setToken(response.token);
        } else if (response.access_token) {
          // Caso a API use 'access_token' em vez de 'token'
          this.setToken(response.access_token);
        }
      })
    );
  }

  // Salva o token
  setToken(token: string): void {
    localStorage.setItem("authToken", token);
    console.log("Token salvo no localStorage:", token.substring(0, 20) + "...");
  }

  // Obtém o token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Remove o token (logout)
  clearToken(): void {
    localStorage.removeItem("authToken");
    this.router.navigate(["/login"]);
  }

  // Verifica se está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    console.log("Usuário autenticado?", isAuth);
    return isAuth;
  }
}
