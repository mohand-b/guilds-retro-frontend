import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {MatCard} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-alliance-request-row',
  standalone: true,
  imports: [
    MatCard,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './alliance-request-row.component.html',
  styleUrl: './alliance-request-row.component.scss'
})
export class AllianceRequestRowComponent {

  @Input() allianceRequest!: AllianceRequestDto;
  @Input() limitAllianceRequests: boolean = false
  
  @Output() acceptRequest = new EventEmitter<AllianceRequestDto>();
  @Output() declineRequest = new EventEmitter<AllianceRequestDto>();

  onAcceptRequest() {
    this.acceptRequest.emit(this.allianceRequest);
  }

  onDeclineRequest() {
    this.declineRequest.emit(this.allianceRequest);
  }
}
