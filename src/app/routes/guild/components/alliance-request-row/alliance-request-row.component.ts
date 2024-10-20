import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {GuildDto} from "../../state/guilds/guild.model";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-alliance-request-row',
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './alliance-request-row.component.html',
  styleUrl: './alliance-request-row.component.scss'
})
export class AllianceRequestRowComponent {

  @Input() allianceRequest!: AllianceRequestDto;
  currentGuild = input<GuildDto>();

  @Output() acceptRequest = new EventEmitter<AllianceRequestDto>();
  @Output() declineRequest = new EventEmitter<AllianceRequestDto>();

  onAcceptRequest() {
    this.acceptRequest.emit(this.allianceRequest);
  }

  onDeclineRequest() {
    this.declineRequest.emit(this.allianceRequest);
  }
}
