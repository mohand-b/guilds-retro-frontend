import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NgClass} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {GuildFacade} from "../../../guild/guild.facade";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {ProfileFacade} from "../../../profile/profile.facade";
import {RouterLink} from "@angular/router";
import {Button} from "primeng/button";

@Component({
  selector: 'app-notification-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateFormatPipe,
    NgClass,
    MatButton,
    RouterLink,
    Button
  ],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;

  private notificationsFacade = inject(NotificationsFacade);
  private profileFacade = inject(ProfileFacade);
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
    this.profileFacade.acceptAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

  onDeclineRequest() {
    this.profileFacade.rejectAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

}
