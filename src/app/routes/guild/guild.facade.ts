import {inject, Injectable, Signal} from "@angular/core";
import {GuildsService} from "./state/guilds/guilds.service";
import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {withRequestsStatus} from "@ngneat/elf-requests";
import {GuildDto, GuildState, LightGuildDto} from "./state/guilds/guild.model";
import {Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MembershipRequestsService} from "./state/membership-requests/membership-requests.service";
import {MembershipRequestDto} from "./state/membership-requests/membership-request.model";
import {authenticatedStore} from "../authenticated/authenticated.facade";
import {UserDto, UserRoleEnum} from "../authenticated/state/authed/authed.model";

export const GUILD_STORE_NAME = 'guild';

export const guildStore = createStore(
  {
    name: GUILD_STORE_NAME,
  },
  withProps<GuildState>({
    id: undefined,
    name: undefined,
    description: undefined,
    members: [],
    allies: [],
    membershipRequests: [],
  }),
  withRequestsStatus(),
);


@Injectable({providedIn: 'root'})
export class GuildFacade {

  currentGuild$: Signal<GuildState> = toSignal(guildStore.pipe(select((
    state) => state)), {
    initialValue: guildStore.value,
  });
  pendingMembershipRequests$: Signal<MembershipRequestDto[]> = toSignal(guildStore.pipe(select((
    state) => state.membershipRequests)), {
    initialValue: guildStore.value.membershipRequests,
  });

  private guildsService = inject(GuildsService);
  private membershipsRequestService = inject(MembershipRequestsService);

  getCurrentGuild(): Observable<GuildDto> {
    return this.guildsService.getCurrentGuild().pipe(
      tap({
        next: (guild: GuildDto) => guildStore.update(setProps(guild)),
        error: (error) => console.error(error),
      }),
    );
  }

  getPendingMembershipRequests(guildId: number): Observable<MembershipRequestDto[]> {
    return this.membershipsRequestService.getPendingMembershipRequests(guildId).pipe(
      tap({
        next: (requests: MembershipRequestDto[]) => guildStore.update(
          (state) => ({
            ...state,
            membershipRequests: requests,
          }),
        ),
        error: (error) => console.error(error),
      }),
    );
  }

  acceptMembershipRequest(requestId: number): Observable<MembershipRequestDto> {
    return this.membershipsRequestService.acceptMembershipRequest(requestId).pipe(
      tap({
        next: (request: MembershipRequestDto) => {
          guildStore.update(
            (state) => ({
              ...state,
              members: [...state.members, request.user],
              membershipRequests: state.membershipRequests.filter(
                (r) => r.id !== request.id,
              ),
            }),
          );

        },
        error: (error) => console.error(error),
      }),
    );
  }

  declineMembershipRequest(requestId: number): Observable<void> {
    return this.membershipsRequestService.rejectMembershipRequest(requestId).pipe(
      tap({
        next: () => {
          guildStore.update(
            (state) => ({
              ...state,
              membershipRequests: state.membershipRequests.filter(
                (r) => r.id !== requestId,
              ),
            }),
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

  getGuildsRecruiting(): Observable<LightGuildDto[]> {
    return this.guildsService.getGuildsRecruiting();
  }

  validateGuildCode(code: string): Observable<{ guildName: string }> {
    return this.guildsService.validateGuildCode(code);
  }

  createMembershipRequest(userId: number, guildId: number): Observable<MembershipRequestDto> {
    return this.membershipsRequestService.createMembershipRequest(userId, guildId).pipe(
      tap({
        next: (request: MembershipRequestDto) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              requests: [...state.requests, request],
            }),
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

  getMembershipRequestsForCurrentUser(): Observable<MembershipRequestDto[]> {
    return this.membershipsRequestService.getMembershipRequestsForCurrentUser().pipe(
      tap({
        next: (requests: MembershipRequestDto[]) => authenticatedStore.update(
          (state) => ({
            ...state,
            requests,
          }),
        ),
        error: (error) => console.error(error),
      }),
    );
  }

  updateUserRole(userId: number, role: UserRoleEnum): Observable<UserDto> {
    return this.guildsService.updateUserRole(userId, role).pipe(
      tap({
        next: (user: UserDto) => {
          guildStore.update(
            (state) => ({
              ...state,
              members: state.members.map((member) => {
                if (member.id === user.id) {
                  return user;
                }
                return member;
              }),
            }),
          );
        },
        error: (error) => console.error(error),
      })
    );
  }
}
