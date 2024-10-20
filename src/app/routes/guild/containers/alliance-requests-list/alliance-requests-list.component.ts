import {Component, inject, Signal} from '@angular/core';
import {AllianceRequestRowComponent} from "../../components/alliance-request-row/alliance-request-row.component";
import {GuildFacade} from "../../guild.facade";
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {GuildState} from "../../state/guilds/guild.model";

@Component({
  selector: 'app-alliance-requests-list',
  standalone: true,
  imports: [
    AllianceRequestRowComponent,
    AlertComponent,
  ],
  templateUrl: './alliance-requests-list.component.html',
  styleUrl: './alliance-requests-list.component.scss'
})
export class AllianceRequestsListComponent {

  private guildFacade = inject(GuildFacade);
  currentGuild: Signal<GuildState> = this.guildFacade.currentGuild;
  receivedPendingAllianceRequests = this.guildFacade.receivedPendingAllianceRequests;

  onAcceptRequest(request: AllianceRequestDto) {
    this.guildFacade.acceptAllianceRequest(request.id).subscribe();
  }

  onDeclineRequest(request: AllianceRequestDto) {
    this.guildFacade.rejectAllianceRequest(request.id).subscribe();
  }

}
