import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NotificationDto} from "../../../../shared/state/notifications/notification.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-notification-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateFormatPipe,
    NgClass
  ],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;

}
