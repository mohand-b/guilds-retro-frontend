import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NotificationDto, NotificationTypeEnum} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NgClass} from "@angular/common";
import {GuildFacade} from "../../../guild/guild.facade";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {ProfileFacade} from "../../../profile/profile.facade";
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-notification-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateFormatPipe,
    NgClass,
    RouterLink,
    ButtonModule
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
    this.guildFacade.acceptMembershipRequest(this.notification.membershipRequest!.id).subscribe();
  }

  onDeclineMembershipRequest() {
    this.guildFacade.declineMembershipRequest(this.notification.membershipRequest!.id).subscribe();
  }

  onAcceptAllianceRequest() {
    this.guildFacade.acceptAllianceRequest(this.notification.alliance!.id).subscribe();
  }

  onDeclineAllianceRequest() {
    this.guildFacade.rejectAllianceRequest(this.notification.alliance!.id).subscribe();
  }

  onAcceptAccountlinkRequest() {
    this.profileFacade.acceptAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

  onDeclineAccountlinkRequest() {
    this.profileFacade.rejectAccountlinkRequest(this.notification.accountLinkRequest.id).subscribe();
  }

  protected readonly NotificationTypeEnum = NotificationTypeEnum;
}
