import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NgClass} from "@angular/common";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {MatButton} from "@angular/material/button";
import {GuildFacade} from "../../../guild/guild.facade";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";

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

  private notificationsFacade = inject(NotificationsFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  private guildFacade = inject(GuildFacade);

  onAcceptMembershipRequest() {
    this.guildFacade.acceptMembershipRequest(this.notification.membershipRequest!.id).subscribe(
      () => this.notificationsFacade.removeNotification(this.notification.id)
    );
  }

  onDeclineMembershipRequest() {
    this.guildFacade.declineMembershipRequest(this.notification.membershipRequest!.id).subscribe(
      () => this.notificationsFacade.removeNotification(this.notification.id)
    );
  }

  onAcceptRequest() {
    this.authenticatedFacade.acceptAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

  onDeclineRequest() {
    this.authenticatedFacade.rejectAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

}
