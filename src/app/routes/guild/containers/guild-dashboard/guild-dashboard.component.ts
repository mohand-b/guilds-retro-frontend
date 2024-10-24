import {Component, effect, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto, MemberDto} from "../../state/guilds/guild.model";
import {EMPTY, forkJoin, switchMap, tap} from "rxjs";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {CommonModule} from "@angular/common";
import {GuildHeaderComponent} from "../../components/guild-header/guild-header.component";
import {GuildMembersTableComponent} from "../../components/guild-members-table/guild-members-table.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {UserDto} from "../../../profile/state/users/user.model";
import {GuildStatsComponent} from "../guild-stats/guild-stats.component";
import {AllianceRequestsListComponent} from "../alliance-requests-list/alliance-requests-list.component";
import {MembershipRequestsTabComponent} from "../membership-requests-tab/membership-requests-tab.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {InputSwitchModule} from "primeng/inputswitch";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ButtonModule} from "primeng/button";
import {BadgeModule} from "primeng/badge";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";

@Component({
  selector: 'app-guild-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AllianceCardComponent,
    GuildHeaderComponent,
    GuildMembersTableComponent,
    GuildMembersTableComponent,
    GuildStatsComponent,
    ProgressSpinnerModule,
    InputSwitchModule,
    PageBlockComponent,
    ButtonModule,
    BadgeModule,
    AlertComponent
  ],
  templateUrl: './guild-dashboard.component.html',
  styleUrls: ['./guild-dashboard.component.scss']
})
export class GuildDashboardComponent implements OnInit {

  public loading: boolean = false;
  public statsLoading: boolean = true;
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
      ),
    ).subscribe();
  }

  public onOpenPendingAllianceRequests(): void {
    const ref = this.genericModalService.open(
      "Demandes d'alliances en attente",
      {},
      'xl',
      {},
      AllianceRequestsListComponent,
      undefined,
    );

    ref.onClose.subscribe();
  }

  public onOpenPendingMembershipRequests(): void {
    const ref = this.genericModalService.open(
      "Demandes d'adhésion en attente",
      {},
      'xl',
      {},
      MembershipRequestsTabComponent,
      undefined,
    );

    ref.onClose.subscribe();
  }

  public updateRole({user, role}: { user: MemberDto, role: UserRoleEnum }): void {
    const ref = this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir changer le rôle de ${user.username} à ${role} ?`,
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.updateUserRole(user.id, role) : EMPTY)
    ).subscribe();
  }

  public removeMember(user: MemberDto): void {
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir exclure ${user.username} de la guilde sur Guilds Retro ?`
    );

    ref.onClose.pipe(
      switchMap(() => EMPTY)
    ).subscribe();
  }

  public updateGuildLevel(level: number): void {
    const ref = this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui'},
      'sm',
      null,
      null,
      `Confirmes-tu que la guilde est passée au niveau ${level} ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.updateGuildLevel(this.guild()!.id!, level) : EMPTY)
    ).subscribe(() => this.editMode.set(false));
  }


  public toggleUpdateGuildHideStats(hideStats: boolean): void {
    const messageForHide = "Les statistiques de la guilde ne seront visibles que par les membres de la guilde."
    const messageForShow = "Les statistiques de la guilde seront visibles par tout le monde."
    const ref = this.genericModalService.open(
      hideStats ? "Masquer les statistiques de la guilde" : "Afficher les statistiques de la guilde",
      {primary: 'Confirmer', icon: hideStats ? 'pi pi-eye-slash' : 'pi pi-eye'},
      'sm',
      null,
      null,
      hideStats ? messageForHide : messageForShow
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.updateGuildHideStats(this.guild()!.id!, hideStats) : EMPTY)
    ).subscribe();
  }
}
