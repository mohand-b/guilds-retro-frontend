import {inject, Injectable, Signal} from "@angular/core";
import {GuildsService} from "../guild/state/guilds/guilds.service";
import {UsersService} from "../profile/state/users/users.service";
import {
  PaginatedUserSearchResponseDto,
  UserSearchDto,
  UserSearchResponseDto
} from "./state/user-search/user-search.model";
import {Observable, tap} from "rxjs";
import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {selectPaginationData, updatePaginationData, withPagination} from "@ngneat/elf-pagination";
import {deleteAllEntities, selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {
  GuildSearchDto,
  GuildSearchResponseDto,
  PaginatedGuildSearchResponseDto
} from "./state/guild-search/guild-search.model";
import {toSignal} from "@angular/core/rxjs-interop";

export const USERS_REGISTRY_STORE_NAME = 'users-registry';
export const GUILDS_REGISTRY_STORE_NAME = 'guilds-registry';

export const usersRegistryStore = createStore(
  {
    name: USERS_REGISTRY_STORE_NAME,
  },
  withEntities<UserSearchResponseDto>(),
  withProps<UserSearchDto>({
    username: undefined,
    characterClass: undefined,
    characterLevel: undefined,
    jobName: undefined,
    jobLevel: undefined,
  }),
  withPagination({
    initialPage: 0,
  }),
);

export const guildsRegistryStore = createStore(
  {
    name: GUILDS_REGISTRY_STORE_NAME,
  },
  withEntities<GuildSearchResponseDto>(),
  withProps<GuildSearchDto>({
    name: undefined,
    minAverageLevel: undefined,
  }),
  withPagination({
    initialPage: 0,
  }),
);

@Injectable({providedIn: 'root'})
export class RegistryFacade {

  usersResults: Signal<UserSearchResponseDto[]> =
    toSignal(usersRegistryStore.pipe(selectAllEntities()),
      {initialValue: []}
    );
  guildsResults: Signal<GuildSearchResponseDto[]> =
    toSignal(guildsRegistryStore.pipe(selectAllEntities()),
      {initialValue: []}
    );
  usersRegistryPaginationData = toSignal(usersRegistryStore.pipe(selectPaginationData()));
  guildsRegistryPaginationData = toSignal(guildsRegistryStore.pipe(selectPaginationData()));
  usersFilter: Signal<UserSearchDto> =
    toSignal(usersRegistryStore.pipe(select(state => state)),
      {initialValue: usersRegistryStore.value}
    );
  guildsFilter: Signal<GuildSearchDto> =
    toSignal(guildsRegistryStore.pipe(select(state => state)),
      {initialValue: guildsRegistryStore.value}
    );
  private usersService = inject(UsersService);
  private guildsService = inject(GuildsService);

  searchUsers(userSearchDto: UserSearchDto): Observable<PaginatedUserSearchResponseDto> {
    usersRegistryStore.update(setProps(userSearchDto));
    return this.usersService.searchUsers(userSearchDto).pipe(
      tap({
        next: (response) => {
          usersRegistryStore.update(
            setEntities(response.results),
            updatePaginationData({
              currentPage: response.page,
              perPage: response.limit,
              total: response.total,
              lastPage: Math.ceil(response.total / response.limit),
            }),
          );
        }
      })
    );
  }

  searchGuilds(guildSearchDto: GuildSearchDto): Observable<PaginatedGuildSearchResponseDto> {
    guildsRegistryStore.update(setProps(guildSearchDto));
    return this.guildsService.searchGuilds(guildSearchDto).pipe(
      tap({
        next: (response) => {
          guildsRegistryStore.update(
            setEntities(response.results),
            updatePaginationData({
              currentPage: response.page,
              perPage: response.limit,
              total: response.total,
              lastPage: Math.ceil(response.total / response.limit),
            })
          );
        }
      })
    );
  }

  resetUsersFilter() {
    usersRegistryStore.update(
      deleteAllEntities(),
      setProps({
        username: undefined,
        characterClass: undefined,
        characterLevel: undefined,
        jobName: undefined,
        jobLevel: undefined,
      }));
  }


}
