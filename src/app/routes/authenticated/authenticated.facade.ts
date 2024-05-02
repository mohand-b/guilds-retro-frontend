import {Injectable} from '@angular/core';
import {createStore, withProps} from '@ngneat/elf';
import {AuthedStateDto, GuildDto, UserDto} from './state/authed/authed.model';
import {createRequestsStatusOperator, withRequestsStatus,} from '@ngneat/elf-requests';
import {localStorageStrategy, persistState} from '@ngneat/elf-persist-state';
import {Router} from "@angular/router";

export const AUTHENTICATED_STORE_NAME = 'authenticated';

export const authenticatedStore = createStore(
  {
    name: AUTHENTICATED_STORE_NAME,
  },
  withProps<AuthedStateDto>({
    user: undefined,
    guild: undefined,
    token: undefined,
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

  constructor(
    private router: Router,
  ) {
  }

  logout(): void {
    authenticatedStore.reset();
    this.router.navigateByUrl('/auth');
  }

  getState(): AuthedStateDto {
    return authenticatedStore.value;
  }

  getCurrentUser(): Omit<UserDto, "guild"> | undefined {
    return this.getState().user;
  }

  getGuild(): Pick<GuildDto, "id" | "name" | "description"> | undefined {
    return this.getState().guild;
  }
}
