import {Component, effect, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
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
import {AllianceRequestsListComponent} from "../alliance-requests-list/alliance-requests-list.component";
import {MembershipRequestsTabComponent} from "../membership-requests-tab/membership-requests-tab.component";
import {MatIconModule} from "@angular/material/icon";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {UserDto} from "../../../profile/state/users/user.model";
import {GuildStatsComponent} from "../guild-stats/guild-stats.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
    GuildStatsComponent,
    MatSlideToggleModule
  ],
  templateUrl: './guild-dashboard.component.html',
  styleUrls: ['./guild-dashboard.component.scss']
})
export class GuildDashboardComponent implements OnInit {

  public loading: boolean = false;
  public editMode: WritableSignal<boolean> = signal(false);
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private readonly guildFacade = inject(GuildFacade);
  public guild: Signal<GuildDto | undefined> = this.guildFacade.currentGuild
  public readonly pendingAllianceRequestsCount: Signal<number> = this.guildFacade.pendingAllianceRequestsCount;
  public readonly pendingMembershipRequestsCount: Signal<number> = this.guildFacade.pendingMembershipRequestsCount;
  loadAllianceRequests = effect(() => {
    if (this.authenticatedFacade.currentUser()!.guild.id!)
      this.guildFacade.getAllianceRequests(this.authenticatedFacade.currentUser()!.guild.id!).subscribe();
  })
  private genericModalService = inject(GenericModalService);

  ngOnInit(): void {
    if (!this.guild()?.id) {
      this.loading = true;
    }

    this.guildFacade.getCurrentGuild().pipe(
      tap(() => {
        this.loading = false;
      }),
      switchMap((guild) =>
        forkJoin([
          this.guildFacade.getPaginatedMembers(guild.id!, 1, 200),
          this.guildFacade.getPendingMembershipRequests(guild.id!),
        ])
      )
    ).subscribe();
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

  public updateGuildLevel(level: number): void {
    this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui'},
      'sm',
      null,
      null,
      `Confirmes-tu que la guilde est passée au niveau ${level} ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return this.guildFacade.updateGuildLevel(this.guild()!.id!, level);
        else return EMPTY;
      })
    ).subscribe(() => this.editMode.set(false));
  }

  public toggleUpdateGuildHideStats(hideStats: boolean): void {
    this.guildFacade.updateGuildHideStats(this.guild()!.id!, hideStats).subscribe();
  }
}
