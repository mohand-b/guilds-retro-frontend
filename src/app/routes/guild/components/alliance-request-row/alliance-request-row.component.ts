import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {GuildDto} from "../../state/guilds/guild.model";

@Component({
  selector: 'app-alliance-request-row',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
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
