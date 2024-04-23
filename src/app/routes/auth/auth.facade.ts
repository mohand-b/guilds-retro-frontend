import {inject, Injectable} from "@angular/core";
import {AuthService} from "./state/auth/auth.service";
import {Observable, tap} from "rxjs";
import {AuthedStateDto} from "../authenticated/state/authed/authed.model";
import {
  AUTHENTICATED_STORE_NAME,
  authenticatedStore,
  trackAuthedRequestsStatus
} from "../authenticated/authenticated.facade";
import {updateRequestStatus} from "@ngneat/elf-requests";
import {LoginDto} from "./state/auth/auth.model";

@Injectable({providedIn: 'root'})
export class AuthFacade {

  private authService = inject(AuthService);


  login(loginDto: LoginDto): Observable<AuthedStateDto> {
    return this.authService.login(loginDto).pipe(
      tap({
        next: (response) => {
          console.log('response', response);
          authenticatedStore.update(
            (state) => ({
              ...state,
              token: response.token,
              user: response.user,
              guild: response.guild
            }),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
        },
        error: () => {
          console.log('error');
        },
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    );
  }
}
