import {Injectable} from '@angular/core';
import {createStore, withProps} from '@ngneat/elf';
import {AuthedStateDto} from './state/authed/authed.model';
import {createRequestsStatusOperator, withRequestsStatus,} from '@ngneat/elf-requests';
import {localStorageStrategy, persistState} from '@ngneat/elf-persist-state';

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

  logout(): void {
    authenticatedStore.reset();
  }

  getState(): AuthedStateDto {
    return authenticatedStore.value;
  }
}
