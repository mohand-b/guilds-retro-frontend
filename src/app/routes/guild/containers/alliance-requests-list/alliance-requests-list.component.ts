import {Component, inject, Signal} from '@angular/core';
import {AllianceRequestRowComponent} from "../../components/alliance-request-row/alliance-request-row.component";
import {GuildFacade} from "../../guild.facade";
import {NgForOf, NgIf} from "@angular/common";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {GuildState} from "../../state/guilds/guild.model";
import {EMPTY, switchMap} from "rxjs";

@Component({
  selector: 'app-alliance-requests-list',
  standalone: true,
  imports: [
    AllianceRequestRowComponent,
    NgForOf,
    AlertComponent,
    NgIf
  ],
  templateUrl: './alliance-requests-list.component.html',
  styleUrl: './alliance-requests-list.component.scss'
})
export class AllianceRequestsListComponent {

  private guildFacade = inject(GuildFacade);
  currentGuild: Signal<GuildState> = this.guildFacade.currentGuild;
  receivedPendingAllianceRequests = this.guildFacade.receivedPendingAllianceRequests;
  private genericModalService = inject(GenericModalService);

  onAcceptRequest(request: AllianceRequestDto) {
    const ref = this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui, accepter'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir accepter la guilde ${request.requesterGuild?.name} en tant qu'alliée ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.acceptAllianceRequest(request.id) : EMPTY)
    ).subscribe();
  }

  onDeclineRequest(request: AllianceRequestDto) {
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui, refuser'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir refuser la guilde ${request.requesterGuild?.name} en tant qu'alliée ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.rejectAllianceRequest(request.id) : EMPTY)
    ).subscribe();
  }

}
