import {Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildState, GuildSummaryDto} from "../../state/guilds/guild.model";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {EMPTY, forkJoin, switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {MatBadgeModule} from "@angular/material/badge";
import {GuildSelectionComponent} from "../../../auth/containers/guild-selection/guild-selection.component";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {AllianceRequestsListComponent} from "../alliance-requests-list/alliance-requests-list.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {MembershipRequestsTabComponent} from "../membership-requests-tab/membership-requests-tab.component";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";

@Component({
  selector: 'app-guild',
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
  ],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss'
})
export class GuildComponent implements OnInit {

  private readonly authenticatedFacade = inject(AuthenticatedFacade);
  private readonly guildFacade = inject(GuildFacade);
  private readonly genericModalService = inject(GenericModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly pendingAllianceRequestsCount$: Signal<number> = this.guildFacade.pendingAllianceRequestsCount$;
  public readonly pendingMembershipRequestsCount$: Signal<number> = this.guildFacade.pendingMembershipRequestsCount$;
  public readonly currentGuild$: Signal<GuildState> = this.guildFacade.currentGuild$;
  public readonly currentUser$: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;
  public readonly guildsForAlliance$: Signal<GuildSummaryDto[]> = this.guildFacade.possiblesGuildsForAlliance$;

  public loading: boolean = false;

  ngOnInit(): void {
    if (!this.currentGuild$().id) {
      this.loading = true;
    }
    this.guildFacade.getCurrentGuild().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((guild) =>
        forkJoin([
          this.guildFacade.getPendingMembershipRequests(guild.id!),
          this.guildFacade.getAllianceRequests(guild.id!),
          this.guildFacade.getGuildsForAlliance()
        ])
      ),
    ).subscribe(() => this.loading = false);
  }

  public onOpenGuildSelection(): void {
    this.genericModalService.open(
      "Choisir une guilde à laquelle s'allier",
      {primary: 'Propose une alliance'},
      'xl',
      {guilds: this.guildsForAlliance$()},
      GuildSelectionComponent,
      undefined,
      true,
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
      true,
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
      true,
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

  protected readonly hasRequiredRole = hasRequiredRole;
  protected readonly UserRoleEnum = UserRoleEnum;
}
