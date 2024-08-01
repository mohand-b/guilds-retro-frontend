import {Component, DestroyRef, inject} from '@angular/core';
import {MainMenuComponent} from "../../../../shared/components/main-menu/main-menu.component";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [
    MainMenuComponent,
    HeaderComponent,
    RouterOutlet,

  ],
  templateUrl: './authenticated.component.html',
  styleUrl: './authenticated.component.scss'
})
export class AuthenticatedComponent {

  private notificationsFacade = inject(NotificationsFacade);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.notificationsFacade.loadNotifications().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

}
