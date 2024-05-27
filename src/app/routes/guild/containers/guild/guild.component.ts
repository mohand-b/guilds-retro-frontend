import {Component, DestroyRef, effect, inject, OnInit, Signal, ViewChild} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildState} from "../../state/guilds/guild.model";
import {NgForOf, NgIf} from "@angular/common";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthFacade} from "../../../auth/auth.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {SortMembersPipe} from "../../../../shared/pipes/sort-members.pipe";
import {GuildTableComponent} from "../../components/guild-table/guild-table.component";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";

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
    GuildTableComponent
  ],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss'
})
export class GuildComponent implements OnInit {

  displayedColumns: string[] = ['username', 'characterClass', 'characterLevel', 'role'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<UserDto> = new MatTableDataSource<UserDto>();
  private guildFacade = inject(GuildFacade);
  currentGuild$: Signal<GuildState> = this.guildFacade.currentGuild$;
  guildUpdated = effect(() => {
    const guild = this.currentGuild$();
    if (guild) {
      const sortedMembers = new SortMembersPipe().transform(guild.members);
      this.dataSource.data = sortedMembers;
      this.dataSource.paginator = this.paginator;
    }
  });
  pendingMembershipRequests$ = this.guildFacade.pendingMembershipRequests$;
  private authFacade = inject(AuthFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser$: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.guildFacade.getCurrentGuild().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((guild) => this.guildFacade.getPendingMembershipRequests(guild.id!))
    ).subscribe();
  }

  acceptRequest(requestId: number) {
    this.guildFacade.acceptMembershipRequest(requestId).subscribe();
  }

  declineRequest(requestId: number) {
    this.guildFacade.declineMembershipRequest(requestId).subscribe();
  }
}
