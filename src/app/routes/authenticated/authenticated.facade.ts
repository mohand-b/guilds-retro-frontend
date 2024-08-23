import {inject, Injectable, Signal} from '@angular/core';
import {createStore, getRegistry, select, withProps} from '@ngneat/elf';
import {AuthedStateDto, UserDto} from './state/authed/authed.model';
import {createRequestsStatusOperator, updateRequestStatus, withRequestsStatus,} from '@ngneat/elf-requests';
import {localStorageStrategy, persistState} from '@ngneat/elf-persist-state';
import {Router} from "@angular/router";
import {MembershipRequestDto} from "../guild/state/membership-requests/membership-request.model";
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthedService} from "./state/authed/authed.service";
import {Observable, tap} from "rxjs";

export const AUTHENTICATED_STORE_NAME = 'authenticated';

export const authenticatedStore = createStore(
  {
    name: AUTHENTICATED_STORE_NAME,
  },
  withProps<AuthedStateDto>({
    user: undefined,
    token: undefined,
    requests: []
  }),
  withRequestsStatus(),
);

persistState(authenticatedStore, {
  key: 'guilds-retro-authed',
  storage: localStorageStrategy,
});

export const trackAuthedRequestsStatus =
  createRequestsStatusOperator(authenticatedStore);

@Injectable({providedIn: 'root'})
export class AuthenticatedFacade {

  readonly requests$: Signal<MembershipRequestDto[]> =
    toSignal(authenticatedStore.pipe(
      select(state => state.requests)
    ), {initialValue: authenticatedStore.value.requests});

  readonly token$: Signal<string | undefined> =
    toSignal(authenticatedStore.pipe(
      select(state => state.token)
    ), {initialValue: authenticatedStore.value.token});

  readonly currentUser: Signal<UserDto | undefined> =
    toSignal(authenticatedStore.pipe(
      select(state => state.user)
    ), {initialValue: authenticatedStore.value.user});

  private authedService = inject(AuthedService);
  private router: Router = inject(Router);

  get userId(): number {
    return this.currentUser()!.id!;
  }

  logout(): void {

    getRegistry().forEach(store => store.reset());

    this.router.navigateByUrl('/auth');
  }

  refreshUser(): Observable<AuthedStateDto> {
    return this.authedService.refreshUser().pipe(
      tap({
        next: (response) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              user: response.user,
              token: response.token,
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
