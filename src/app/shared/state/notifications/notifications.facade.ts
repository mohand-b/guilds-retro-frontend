import {inject, Injectable, Signal} from '@angular/core';
import {NotificationsService} from './notifications.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {createStore, withProps} from "@ngneat/elf";
import {addEntities, selectAllEntities, selectEntitiesCount, setEntities, withEntities} from "@ngneat/elf-entities";
import {NotificationDto} from "./notification.model";
import {Observable, tap} from "rxjs";

export const NOTIFICATIONS_STORE_NAME = 'notifications';

const notificationsStore = createStore(
  {name: NOTIFICATIONS_STORE_NAME},
  withEntities<NotificationDto>(),
  withProps<{ loaded: boolean }>({loaded: false})
);

@Injectable({providedIn: 'root'})
export class NotificationsFacade {

  notifications$: Signal<NotificationDto[]> = toSignal(
    notificationsStore.pipe(selectAllEntities()),
    {initialValue: []}
  );
  notificationsCount$: Signal<number> = toSignal(
    notificationsStore.pipe(
      selectEntitiesCount(),
    ),
    {initialValue: 0}
  );

  private notificationsService = inject(NotificationsService);

  constructor() {
    this.notificationsService.listen('notification').subscribe(
      (notification: NotificationDto) => {
        notificationsStore.update(addEntities(notification));
      }
    );
  }

  loadNotifications(): Observable<NotificationDto[]> {
    return this.notificationsService.getNotifications().pipe(
      tap({
        next: (notifications: NotificationDto[]) => notificationsStore.update(setEntities(notifications)),
        error: (error) => console.error(error),
      }),
    );
  }
}
