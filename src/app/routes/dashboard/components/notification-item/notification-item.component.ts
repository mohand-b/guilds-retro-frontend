import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NgClass} from "@angular/common";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-notification-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateFormatPipe,
    NgClass,
    MatButton
  ],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;
  private authenticatedFacade = inject(AuthenticatedFacade);

  onAcceptRequest() {
    this.authenticatedFacade.acceptAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

  onDeclineRequest() {
    this.authenticatedFacade.rejectAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

}
