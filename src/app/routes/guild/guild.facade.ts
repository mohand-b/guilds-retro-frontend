import {computed, inject, Injectable, Signal} from "@angular/core";
import {GuildsService} from "./state/guilds/guilds.service";
import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {withRequestsStatus} from "@ngneat/elf-requests";
import {
  GuildAllianceRequestsDto,
  GuildDto,
  GuildState,
  GuildSummaryDto,
  GuildWithPaginatedMembersDto,
  PaginatedMemberResponseDto
} from "./state/guilds/guild.model";
import {Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {MembershipRequestsService} from "./state/membership-requests/membership-requests.service";
import {MembershipRequestDto} from "./state/membership-requests/membership-request.model";
import {authenticatedStore} from "../authenticated/authenticated.facade";
import {UserRoleEnum} from "../authenticated/state/authed/authed.model";
import {AllianceDto, AllianceRequestDto, AllianceStatusEnum} from "./state/alliances/alliance.model";
import {AlliancesService} from "./state/alliances/alliances.service";
import {UserDto} from "../profile/state/users/user.model";

export const GUILD_STORE_NAME = 'guild';

export const guildStore = createStore(
  {
    name: GUILD_STORE_NAME,
  },
  withProps<GuildState>({
    id: undefined,
    name: undefined,
    description: undefined,
    level: 0,
    members: [],
    allies: [],
    membershipRequests: [],
    receivedAllianceRequests: undefined,
    sentAllianceRequests: undefined
  }),
  withRequestsStatus(),
);

@Injectable({providedIn: 'root'})
export class GuildFacade {

  currentGuild: Signal<GuildState> = toSignal(guildStore.pipe(select(
    (state) => state)), {
    initialValue: guildStore.value,
  });

  pendingMembershipRequests: Signal<MembershipRequestDto[]> = toSignal(guildStore.pipe(select(
    (state) => state.membershipRequests)), {
    initialValue: guildStore.value.membershipRequests,
  });
  pendingMembershipRequestsCount: Signal<number> = computed(() => this.pendingMembershipRequests().length);

  sentPendingAllianceRequests: Signal<AllianceRequestDto[] | undefined> = toSignal(guildStore.pipe(select(
    (state) => state.sentAllianceRequests?.filter(request => request.status === AllianceStatusEnum.PENDING)
  )))

  receivedPendingAllianceRequests: Signal<AllianceRequestDto[] | undefined> = toSignal(guildStore.pipe(select(
    (state) => state.receivedAllianceRequests?.filter(request => request.status === AllianceStatusEnum.PENDING)
  )));

  pendingAllianceRequestsCount: Signal<number> = computed(() => this.receivedPendingAllianceRequests()!.length)

  private guildsService = inject(GuildsService);
  private alliancesService = inject(AlliancesService);
  private membershipsRequestService = inject(MembershipRequestsService);

  // GUILD
  getCurrentGuild(): Observable<GuildDto> {
    return this.guildsService.getCurrentGuild().pipe(
      tap({
        next: (guild: GuildDto) => guildStore.update(setProps(guild)),
        error: (error) => console.error(error),
      }),
    );
  }

  getPaginatedMembers(guildId: number, page: number, limit: number): Observable<PaginatedMemberResponseDto> {
    return this.guildsService.getPaginatedMembers(guildId, page, limit).pipe(
      tap({
        next: (response) => {
          guildStore.update(
            (state) => ({
              ...state,
              members: response.results,
            }),
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

  loadGuildById(guildId: number): Observable<GuildWithPaginatedMembersDto> {
    return this.guildsService.getGuildById(guildId);
  }

  getGuildsRecruiting(): Observable<GuildSummaryDto[]> {
    return this.guildsService.getGuildsRecruiting();
  }

  validateGuildCode(code: string): Observable<{ guildName: string }> {
    return this.guildsService.validateGuildCode(code);
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

  // MEMBERSHIP REQUEST
  getPendingMembershipRequests(guildId: number): Observable<MembershipRequestDto[]> {
    return this.membershipsRequestService.getPendingMembershipRequests(guildId).pipe(
      tap({
        next: (requests: MembershipRequestDto[]) => {
          guildStore.update(
            (state) => ({
              ...state,
              membershipRequests: requests,
            }),
          )
        },
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

  // ALLIANCE
  getAllianceRequests(guildId: number): Observable<GuildAllianceRequestsDto> {
    return this.alliancesService.getAllianceRequests(guildId).pipe(
      tap({
        next: (guildRequests: GuildAllianceRequestsDto) => {
          guildStore.update(
            (state) => ({
              ...state,
              receivedAllianceRequests: guildRequests.receivedAllianceRequests,
              sentAllianceRequests: guildRequests.sentAllianceRequests
            })
          )
        }
      })
    )
  }

  acceptAllianceRequest(requestId: number): Observable<AllianceDto> {
    return this.alliancesService.acceptAllianceRequest(requestId).pipe(
      tap(
        {
          next: (alliance: AllianceDto) => {
            authenticatedStore.update(
              (state) => ({
                ...state,
                user: {
                  ...state.user!,
                  guildAlliesIds: [...state.user?.guildAlliesIds!, alliance.requesterGuild.id],
                }
              })
            )
            guildStore.update(
              (state) => ({
                ...state,
                allies: [...state.allies, alliance.requesterGuild],
                receivedAllianceRequests: state.receivedAllianceRequests?.filter(
                  (r) => r.id !== requestId,
                ),
              }),
            );
          },
          error: (error) => console.error(error),
        },
      ),
    );
  }

  rejectAllianceRequest(requestId: number): Observable<void> {
    return this.alliancesService.rejectAllianceRequest(requestId).pipe(
      tap(
        {
          next: () => {
            guildStore.update(
              (state) => ({
                ...state,
                receivedAllianceRequests: state.receivedAllianceRequests?.filter(
                  (r) => r.id !== requestId,
                ),
              }),
            );
          },
          error: (error) => console.error(error),
        },
      ),
    );
  }

  createAllianceRequest(targetGuildId: number): Observable<AllianceRequestDto> {
    return this.alliancesService.createAllianceRequest(this.currentGuild().id!, targetGuildId).pipe(
      tap({
        next: (alliance: AllianceRequestDto) => {
          guildStore.update(
            (state) => ({
              ...state,
              sentAllianceRequests: state.sentAllianceRequests ? [...state.sentAllianceRequests, alliance] : [alliance],
            }),
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

  dissolveAlliance(guildId1: number, guildId2: number): Observable<AllianceDto> {
    return this.alliancesService.dissolveAlliance(guildId1, guildId2).pipe(
      tap({
        next: (alliance: AllianceDto) => {
          authenticatedStore.update(
            (state) => ({
              ...state,
              user: {
                ...state.user!,
                guildAlliesIds: state.user?.guildAlliesIds?.filter(
                  (id) => id !== alliance.requesterGuild.id,
                ),
              },
            }),
          );
          guildStore.update(
            (state) => ({
              ...state,
              allies: state.allies.filter(
                (ally) => ally.id !== guildId2,
              ),
            }),
          );
        },
        error: (error) => console.error(error),
      }),
    );
  }

}
