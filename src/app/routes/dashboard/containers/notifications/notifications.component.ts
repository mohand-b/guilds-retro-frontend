import {AfterViewInit, Component, ElementRef, inject, OnDestroy, QueryList, Signal, ViewChildren} from '@angular/core';
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
export class NotificationsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('notificationItem', {read: ElementRef}) notificationItems!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;
  private timeoutId!: any;
  private visibleNotifications: Set<number> = new Set();
  private notificationsFacade = inject(NotificationsFacade);
  notifications: Signal<NotificationDto[]> = this.notificationsFacade.notifications;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = Number((entry.target as HTMLElement).dataset['id']);
        if (entry.isIntersecting) {
          this.visibleNotifications.add(id);
          this.startMarkAsReadTimer();
        } else {
          this.visibleNotifications.delete(id);
          if (this.visibleNotifications.size === 0) {
            this.clearMarkAsReadTimer();
          }
        }
      });
    }, {threshold: 0.1});

    this.observeNotifications();
    this.notificationItems.changes.subscribe(() => {
      this.observeNotifications();
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearMarkAsReadTimer();
  }

  private observeNotifications() {
    this.notificationItems.forEach(item => {
      this.observer.observe(item.nativeElement);
    });
  }

  private startMarkAsReadTimer() {
    this.clearMarkAsReadTimer();
    this.timeoutId = setTimeout(() => {
      this.markNotificationsAsRead();
    }, 3000);
  }

  private clearMarkAsReadTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private markNotificationsAsRead() {
    const ids = Array.from(this.visibleNotifications);
    this.notificationsFacade.markNotificationsAsRead(ids).subscribe();
    this.visibleNotifications.clear();
  }
}
