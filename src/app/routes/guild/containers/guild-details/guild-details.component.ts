import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
import {CommonModule, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {EMPTY, forkJoin, of, switchMap, tap} from "rxjs";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../profile/state/users/user.model";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {ClassCountComponent} from "../../components/class-count/class-count.component";
import {GuildStatsComponent} from "../guild-stats/guild-stats.component";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ButtonModule} from "primeng/button";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-guild-details',
  standalone: true,
  imports: [
    CommonModule,
    GuildHeaderComponent,
    GuildMembersTableComponent,
    AllianceCardComponent,
    ClassCountComponent,
    GuildStatsComponent,
    AlertComponent,
    PageBlockComponent,
    ButtonModule,
    BadgeModule
  ],
  templateUrl: './guild-details.component.html',
  styleUrls: ['./guild-details.component.scss']
})
export class GuildDetailsComponent implements OnInit {

  public guild: WritableSignal<GuildDto | undefined> = signal(undefined);
  public loading: boolean = false;
  protected readonly hasRequiredRole = hasRequiredRole;
  protected readonly UserRoleEnum = UserRoleEnum;
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private readonly guildFacade = inject(GuildFacade);
  private readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  private genericModalService = inject(GenericModalService);

  receivedRequests = this.guildFacade.receivedPendingAllianceRequests;
  hasReceivedRequest: Signal<boolean | undefined> = computed(() =>
    this.receivedRequests()?.some(request =>
      request.requesterGuild?.id === this.guild()!.id)
  );
  receivedRequestFromGuild: Signal<AllianceRequestDto | undefined> = computed(() =>
    this.receivedRequests()?.find(request =>
      request.requesterGuild?.id === this.guild()!.id)
  );
  private sentRequests = this.guildFacade.sentPendingAllianceRequests;
  hasSentRequest: Signal<boolean | undefined> = computed(() =>
    this.sentRequests()?.some(request =>
      request.targetGuild?.id === this.guild()!.id)
  );


  ngOnInit(): void {
    this.loading = true;

    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const guildId = Number(params.get('guildId'));
        if (guildId) {
          return this.guildFacade.loadGuildById(guildId).pipe(
            switchMap((guild) => {
              this.guild.set({...guild, members: []});
              this.loading = false;

              const allianceRequests$ = this.guildFacade.getAllianceRequests(this.currentUser()?.guild.id!);

              const paginatedMembers$ = guild.isAlly
                ? this.guildFacade.getPaginatedMembers(guildId, 1, 200)
                : of(null);

              return forkJoin({
                allianceRequests: allianceRequests$,
                paginatedMembers: paginatedMembers$,
              }).pipe(
                tap(({
                       allianceRequests,
                       paginatedMembers,
                     }) => {
                  if (paginatedMembers && paginatedMembers.results) {
                    this.guild.set({...this.guild()!, members: paginatedMembers.results});
                  }
                })
              );
            })
          );
        }
        return EMPTY;
      })
    ).subscribe();
  }

  goBack() {
    this.location.back();
  }

  onAcceptAllianceRequest() {
    const requestId = this.receivedRequestFromGuild()!.id;

    const ref = this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui, accepter'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir accepter la guilde ${this.guild()!.name} en tant qu'alliée ?`
    );

    ref.onClose.pipe(
      switchMap((result) =>
        result
          ? this.guildFacade.acceptAllianceRequest(requestId).pipe(
            tap(() => window.location.reload())
          )
          : EMPTY
      )
    ).subscribe();
  }

  onDeclineAllianceRequest() {
    const requestId = this.receivedRequestFromGuild()!.id;

    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui, refuser'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir refuser la guilde ${this.guild()!.name} en tant qu'alliée ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.rejectAllianceRequest(requestId) : EMPTY)
    ).subscribe();
  }


  onSendAllianceRequest(guildId: number) {
    this.guildFacade.createAllianceRequest(guildId).subscribe();
  }
}

