import {Component, DestroyRef, effect, inject, OnInit, Signal, ViewChild} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildState, GuildSummaryDto} from "../../state/guilds/guild.model";
import {NgForOf, NgIf} from "@angular/common";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {forkJoin, switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthFacade} from "../../../auth/auth.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {SortMembersPipe} from "../../../../shared/pipes/sort-members.pipe";
import {GuildTableComponent} from "../../components/guild-table/guild-table.component";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {MatBadge} from "@angular/material/badge";
import {GuildSelectionComponent} from "../../../auth/containers/guild-selection/guild-selection.component";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {AllianceRequestsListComponent} from "../alliance-requests-list/alliance-requests-list.component";
import {AllianceCardComponent} from "../../components/alliance-card/alliance-card.component";

@Component({
  selector: 'app-guild',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    CharacterIconPipe,
    SortMembersPipe,
    MatPaginatorModule,
    GuildTableComponent,
    MatBadge,
    AllianceCardComponent
  ],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss'
})
export class GuildComponent implements OnInit {

  private authFacade = inject(AuthFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  private guildFacade = inject(GuildFacade);

  private genericModalService = inject(GenericModalService);

  displayedColumns: string[] = ['username', 'characterClass', 'characterLevel', 'role'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<UserDto> = new MatTableDataSource<UserDto>();

  private destroyRef: DestroyRef = inject(DestroyRef);

  pendingAllianceRequests$: Signal<AllianceRequestDto[]> = this.guildFacade.pendingAllianceRequests$;
  pendingAllianceRequestsCount$: Signal<number> = this.guildFacade.pendingAllianceRequestsCount$;
  currentGuild$: Signal<GuildState> = this.guildFacade.currentGuild$;
  pendingMembershipRequests$ = this.guildFacade.pendingMembershipRequests$;
  currentUser$: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;

  guildUpdated = effect(() => {
    const guild = this.currentGuild$();
    if (guild) {
      const sortedMembers = new SortMembersPipe().transform(guild.members);
      this.dataSource.data = sortedMembers;
      this.dataSource.paginator = this.paginator;
    }
  });

  guildsForAlliance$: Signal<GuildSummaryDto[]> = this.guildFacade.possiblesGuildsForAlliance$

  allianceRequests = effect(() => {
    console.log(this.pendingAllianceRequests$())
    console.log(this.pendingAllianceRequestsCount$())
  })

  ngOnInit() {
    this.guildFacade.getCurrentGuild().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((guild) =>
        forkJoin([
          this.guildFacade.getPendingMembershipRequests(guild.id!),
          this.guildFacade.getAllianceRequests(guild.id!),
          this.guildFacade.getGuildsForAlliance()
        ])
      ),
    ).subscribe();

  }


  acceptRequest(requestId: number) {
    this.guildFacade.acceptMembershipRequest(requestId).subscribe();
  }

  declineRequest(requestId: number) {
    this.guildFacade.declineMembershipRequest(requestId).subscribe();
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

}
