import {Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildState} from "../../state/guilds/guild.model";
import {NgForOf, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthFacade} from "../../../auth/auth.facade";

@Component({
  selector: 'app-guild',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss'
})
export class GuildComponent implements OnInit {

  private guildFacade = inject(GuildFacade);
  currentGuild$: Signal<GuildState> = this.guildFacade.currentGuild$;
  pendingMembershipRequests$ = this.guildFacade.pendingMembershipRequests$;
  private authFacade = inject(AuthFacade);
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
