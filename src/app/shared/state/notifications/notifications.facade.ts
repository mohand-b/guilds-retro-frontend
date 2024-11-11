import {inject, Injectable, Signal} from '@angular/core';
import {NotificationsService} from './notifications.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {createStore, withProps} from "@ngneat/elf";
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  selectEntitiesCountByPredicate,
  setEntities,
  updateEntities,
  withEntities
} from "@ngneat/elf-entities";
import {NotificationDto} from "./notification.model";
import {forkJoin, map, Observable, tap} from "rxjs";

export const NOTIFICATIONS_STORE_NAME = 'notifications';

const notificationsStore = createStore(
  {name: NOTIFICATIONS_STORE_NAME},
  withEntities<NotificationDto>(),
  withProps<{ loaded: boolean }>({loaded: false})
);

@Injectable({providedIn: 'root'})
export class NotificationsFacade {

  notifications: Signal<NotificationDto[]> = toSignal(
    notificationsStore.pipe(
      selectAllEntities(),
      map(notifications => notifications
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    ),
    {initialValue: []}
  );
  unreadNotificationsCount: Signal<number> = toSignal(
    notificationsStore.pipe(
      selectEntitiesCountByPredicate(notification => !notification.read),
    ),
    {initialValue: 0}
  );

  private notificationsService = inject(NotificationsService);

  constructor() {
    forkJoin([
      this.notificationsService.listen('notification').pipe(
        tap((notification: NotificationDto) => {
          notificationsStore.update(addEntities(notification));
          this.notificationsService.showBrowserNotification(notification);
        })
      ),
      this.notificationsService.listen('cancel-notification').pipe(
        tap((notificationId: number) => {
          this.removeNotification(notificationId)
          console.log(`Notification ${notificationId} has been cancelled`);
        })
      ),
    ]).subscribe();
  }

  loadNotifications(): Observable<NotificationDto[]> {
    return this.notificationsService.getNotifications().pipe(
      tap({
        next: (notifications: NotificationDto[]) => {
          notificationsStore.update(setEntities(notifications))
        },
        error: (error) => console.error(error),
      }),
    );
  }

  markNotificationsAsRead(notificationIds: number[]): Observable<NotificationDto[]> {
    return this.notificationsService.markNotificationsAsRead(notificationIds).pipe(
      tap({
        next: (notifications: NotificationDto[]) => notificationsStore.update(
          updateEntities(notifications.map(notification => notification.id), {read: true})
        ),
        error: (error) => console.error(error),
      }),
    );
  }

  removeNotification(notificationId: number): void {
    notificationsStore.update(deleteEntities(notificationId));
  }
}
