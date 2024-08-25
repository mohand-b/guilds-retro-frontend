import {inject, Injectable, Signal} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticatedFacade} from "../../routes/authenticated/authenticated.facade";

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  private authenticatedFacade = inject(AuthenticatedFacade);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token: Signal<string | undefined> = this.authenticatedFacade.token$;

    if (token() && !request.headers.has('Authorization')) {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${token()}`);
      request = request.clone({headers});
    }

    return next.handle(request).pipe(
      catchError((error) => throwError(error)),
    );
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptorService,
  multi: true,
};
