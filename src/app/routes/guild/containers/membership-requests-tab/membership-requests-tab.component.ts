import {Component, inject, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {MembershipRequestDto} from "../../state/membership-requests/membership-request.model";

@Component({
  selector: 'app-membership-requests-tab',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    CharacterIconPipe,
    NgIf,
    AlertComponent
  ],
  templateUrl: './membership-requests-tab.component.html',
  styleUrl: './membership-requests-tab.component.scss'
})
export class MembershipRequestsTabComponent {

  private guildFacade = inject(GuildFacade);
  pendingMembershipRequests$: Signal<MembershipRequestDto[]> = this.guildFacade.pendingMembershipRequests$;
  pendingMembershipRequestsCount$: Signal<number> = this.guildFacade.pendingMembershipRequestsCount$;

  displayedColumns: string[] = ['username', 'characterClass', 'characterLevel', 'actions'];

  acceptRequest(requestId: number) {
    this.guildFacade.acceptMembershipRequest(requestId).subscribe();
  }

  declineRequest(requestId: number) {
    this.guildFacade.declineMembershipRequest(requestId).subscribe();
  }

}
