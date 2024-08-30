import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto, GuildSummaryDto} from "../../state/guilds/guild.model";
import {EMPTY, forkJoin, switchMap, tap} from "rxjs";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {GuildSelectionComponent} from "../../../auth/containers/guild-selection/guild-selection.component";
import {AllianceRequestsListComponent} from "../alliance-requests-list/alliance-requests-list.component";
import {MembershipRequestsTabComponent} from "../membership-requests-tab/membership-requests-tab.component";
import {MatIconModule} from "@angular/material/icon";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {UserDto} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-guild-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    AllianceCardComponent,
    GuildHeaderComponent,
    GuildMembersTableComponent,
    MatIconModule,
    GuildMembersTableComponent,
  ],
  templateUrl: './guild-dashboard.component.html',
  styleUrls: ['./guild-dashboard.component.scss']
})
export class GuildDashboardComponent implements OnInit {

  public loading: boolean = false;
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private readonly guildFacade = inject(GuildFacade);
  public guild: Signal<GuildDto | undefined> = this.guildFacade.currentGuild
  public readonly pendingAllianceRequestsCount: Signal<number> = this.guildFacade.pendingAllianceRequestsCount;
  public readonly pendingMembershipRequestsCount: Signal<number> = this.guildFacade.pendingMembershipRequestsCount;
  public readonly guildsForAlliance: Signal<GuildSummaryDto[]> = this.guildFacade.possiblesGuildsForAlliance;
  loadAllianceRequests = effect(() => {
    if (this.authenticatedFacade.currentUser()!.guild.id!)
      this.guildFacade.getAllianceRequests(this.authenticatedFacade.currentUser()!.guild.id!).subscribe();
  })

  private readonly genericModalService = inject(GenericModalService);

  ngOnInit(): void {
    this.loading = true;

    this.guildFacade.getCurrentGuild().pipe(
      tap(() => {
        this.loading = false;
      }),
      switchMap((guild) =>
        forkJoin([
          this.guildFacade.getPendingMembershipRequests(guild.id!),
          this.guildFacade.getGuildsForAlliance()
        ])
      )
    ).subscribe();
  }

  public onOpenGuildSelection(): void {
    this.genericModalService.open(
      "Choisir une guilde à laquelle s'allier",
      {primary: 'Proposer une alliance'},
      'xl',
      {guilds: this.guildsForAlliance()},
      GuildSelectionComponent,
      undefined,
      true
    ).subscribe(selectedGuild => {
      if (selectedGuild) {
        this.guildFacade.createAllianceRequest(selectedGuild.id).subscribe();
      }
    });
  }

  public onOpenPendingAllianceRequests(): void {
    this.genericModalService.open(
      "Demandes d'alliances en attente",
      {},
      'xl',
      {},
      AllianceRequestsListComponent,
      undefined,
      true
    ).subscribe();
  }

  public onOpenPendingMembershipRequests(): void {
    this.genericModalService.open(
      "Demandes d'adhésion en attente",
      {},
      'xl',
      {},
      MembershipRequestsTabComponent,
      undefined,
      true
    ).subscribe();
  }

  public updateRole({user, role}: { user: UserDto, role: UserRoleEnum }): void {
    this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir changer le rôle de ${user.username} à ${role} ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return this.guildFacade.updateUserRole(user.id, role);
        else return EMPTY;
      })
    ).subscribe();
  }

  public removeMember(user: UserDto): void {
    this.genericModalService.open(
      'Confirmation',
      {warn: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir exclure ${user.username} de la guilde sur Guilds Retro ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return EMPTY;
        else return EMPTY;
      })
    ).subscribe();
  }
}
