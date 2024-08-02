import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";

@Component({
  selector: 'app-notification-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateFormatPipe
  ],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss'
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;

}
