import {Component, DestroyRef, inject, signal, WritableSignal} from '@angular/core';
import {MainMenuComponent} from "../../../../shared/components/main-menu/main-menu.component";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NotificationsComponent} from "../../../dashboard/containers/notifications/notifications.component";
import {SidebarModule} from "primeng/sidebar";

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [
    MainMenuComponent,
    HeaderComponent,
    RouterOutlet,
    NotificationsComponent,
    SidebarModule,
  ],
  templateUrl: './authenticated.component.html',
  styleUrl: './authenticated.component.scss'
})
export class AuthenticatedComponent {

  showNotifications: WritableSignal<boolean> = signal(false);

  protected readonly scroll = scroll;
  private notificationsFacade = inject(NotificationsFacade);
  public readonly unreadNotificationsCount = this.notificationsFacade.unreadNotificationsCount;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.notificationsFacade.loadNotifications().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
  }


}
