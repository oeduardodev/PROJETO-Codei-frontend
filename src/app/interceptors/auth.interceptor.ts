import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../environment/environments";
import { PUBLIC_ENDPOINTS } from "../enum/endpoints.enum";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("authToken");

    // Se for endpoint público, NÃO faz nada
    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }

    let clonedRequest = req;

    // Apenas endpoints privados recebem token
    if (token && req.url.includes(environment.endpoint)) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          req.url.includes(environment.endpoint) &&
          !this.isPublicEndpoint(req.url)
        ) {
          localStorage.removeItem("authToken");
          this.router.navigate(["/login"]);
        }

        return throwError(() => error);
      })
    );
  }

  private isPublicEndpoint(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
  }
}
