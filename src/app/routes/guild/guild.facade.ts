import {inject, Injectable, Signal} from "@angular/core";
import {GuildsService} from "./state/guilds/guilds.service";
import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {withRequestsStatus} from "@ngneat/elf-requests";
import {GuildDto, GuildState} from "./state/guilds/guild.model";
import {Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MembershipRequestsService} from "./state/membership-requests/membership-requests.service";
import {MembershipRequestDto} from "./state/membership-requests/membership-request.request";

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
}
