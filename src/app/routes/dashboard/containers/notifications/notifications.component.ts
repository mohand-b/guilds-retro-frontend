import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  QueryList,
  Signal,
  ViewChildren
} from '@angular/core';
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
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('notificationItem', {read: ElementRef}) notificationItems!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;
  private timeoutId!: any;
  private visibleNotifications: Set<number> = new Set();
  private notificationsFacade = inject(NotificationsFacade);
  notifications: Signal<NotificationDto[]> = this.notificationsFacade.notifications;

  groupedNotifications = computed(() => {
    const grouped: { [postId: number]: NotificationDto[] } = {};

    this.notifications().forEach((notification) => {
      if (notification.type === 'like' && notification.like?.post?.id) {
        const postId = notification.like.post.id;
        grouped[postId] = grouped[postId] || [];
        grouped[postId].push(notification);
      } else {
        grouped[notification.id] = [notification];
      }
    });

    const transformedNotifications: NotificationDto[] = Object.values(grouped).map((group) => {
      if (group.length === 1) {
        return {
          ...group[0],
          groupedNotificationIds: [group[0].id]
        };
      }

      const latestNotification = group.reduce((latest, notif) =>
        new Date(notif.createdAt) > new Date(latest.createdAt) ? notif : latest, group[0]
      );
      const latestDate = group.reduce((max, notif) =>
        new Date(notif.createdAt) > max ? new Date(notif.createdAt) : max, new Date(0)
      );

      return {
        ...latestNotification,
        message: `${latestNotification.emitter?.username} et ${group.length - 1} autre${group.length > 2 ? 's' : ''} ont liké ton post`,
        createdAt: latestDate,
        groupedNotificationIds: group.map(notif => notif.id)
      };
    });

    return transformedNotifications.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

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
    const ids: number[] = Array.from(this.visibleNotifications).flatMap(visibleId => {
      const group = this.groupedNotifications().find(notification => notification.id === visibleId);
      return group?.groupedNotificationIds ? group.groupedNotificationIds : [visibleId];
    });

    this.notificationsFacade.markNotificationsAsRead(ids).subscribe();
    this.visibleNotifications.clear();
  }


}
