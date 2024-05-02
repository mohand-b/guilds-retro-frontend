import {inject, Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticatedFacade} from "../../routes/authenticated/authenticated.facade";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  private authenticatedFacade = inject(AuthenticatedFacade);
  private router = inject(Router);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const state = this.authenticatedFacade.getState();

    if (state && state.token && !request.headers.has('Authorization')) {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${state.token}`);
      request = request.clone({headers});
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.endsWith('/login')
        ) {
          this.authenticatedFacade.logout();
        }
        return throwError(error);
      }),
    );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptorService,
  multi: true,
};

