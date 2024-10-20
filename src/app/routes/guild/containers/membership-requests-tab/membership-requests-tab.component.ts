import {Component, inject, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {MembershipRequestDto} from "../../state/membership-requests/membership-request.model";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-membership-requests-tab',
  standalone: true,
  imports: [
    CharacterIconPipe,
    AlertComponent,
    TableModule,
    ButtonModule
  ],
  templateUrl: './membership-requests-tab.component.html',
  styleUrl: './membership-requests-tab.component.scss'
})
export class MembershipRequestsTabComponent {

  private guildFacade = inject(GuildFacade);
  pendingMembershipRequests: Signal<MembershipRequestDto[]> = this.guildFacade.pendingMembershipRequests;
  pendingMembershipRequestsCount: Signal<number> = this.guildFacade.pendingMembershipRequestsCount;

  acceptRequest(requestId: number) {
    this.guildFacade.acceptMembershipRequest(requestId).subscribe();
  }

  declineRequest(requestId: number) {
    this.guildFacade.declineMembershipRequest(requestId).subscribe();
  }

}
