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
import {LoginDto, RegisterMemberDto} from "./state/auth/auth.model";
import {setProps} from "@ngneat/elf";
import {feedStore} from "../feed/feed.facade";

@Injectable({providedIn: 'root'})
export class AuthFacade {

  private authService = inject(AuthService);

  login(loginDto: LoginDto): Observable<AuthedStateDto> {
    return this.authService.login(loginDto).pipe(
      tap({
        next: (response) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              token: response.token,
              user: response.user,
            }),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
          feedStore.update(setProps(
            {feedClosingToGuildAndAllies: response.user?.feedClosingToGuildAndAllies}
          ))
        },
        error: () => {
          console.log('error');
        },
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    );
  }

  registerAsMember(registerMemberDto: RegisterMemberDto): Observable<AuthedStateDto> {
    return this.authService.registerAsMember(registerMemberDto).pipe(
      tap({
        next: (response) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              token: response.token,
              user: response.user,
            }),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
          feedStore.update(setProps(
            {feedClosingToGuildAndAllies: response.user?.feedClosingToGuildAndAllies}
          ))
        },
        error: () => {
          console.log('error');
        },
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    );
  }

  registerAsLeader(registerLeaderFormData: FormData): Observable<AuthedStateDto> {
    return this.authService.registerAsLeader(registerLeaderFormData).pipe(
      tap({
        next: (response) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              token: response.token,
              user: response.user,
            }),
            updateRequestStatus(AUTHENTICATED_STORE_NAME, 'success'),
          );
          feedStore.update(setProps(
            {feedClosingToGuildAndAllies: response.user?.feedClosingToGuildAndAllies}
          ))
        },
        error: () => {
          console.log('error');
        },
      }),
      trackAuthedRequestsStatus(AUTHENTICATED_STORE_NAME),
    );
  }


}
