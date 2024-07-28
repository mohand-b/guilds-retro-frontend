import {Injectable, signal} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {NotificationDto} from "./notification.model";

@Injectable({providedIn: 'root'})
export class NotificationsService {
  private socket$: WebSocketSubject<any>;
  private notificationsSignal = signal<NotificationDto[]>([]);

  constructor() {
    this.socket$ = new WebSocketSubject('ws://your-websocket-url');
    this.socket$.subscribe(message => this.addNotification(message));
  }

  get notifications$() {
    return this.notificationsSignal.asReadonly();
  }

  markAsRead(notificationId: number) {
    this.notificationsSignal.set(
      this.notificationsSignal().map(notification =>
        notification.id === notificationId ? {...notification, read: true} : notification
      )
    );
  }

  private addNotification(message: any) {
    const notification: NotificationDto = {
      id: message.id,
      message: message.text,
      read: false,
      type: message.type
    };
    this.notificationsSignal.set([...this.notificationsSignal(), notification]);
  }
}
