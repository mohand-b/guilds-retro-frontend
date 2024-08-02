import {Component, inject, Signal} from '@angular/core';
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {NotificationItemComponent} from "../../components/notification-item/notification-item.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationItemComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  private readonly notificationsFacade = inject(NotificationsFacade);

  notifications: Signal<NotificationDto[]> = this.notificationsFacade.notifications$;

}
