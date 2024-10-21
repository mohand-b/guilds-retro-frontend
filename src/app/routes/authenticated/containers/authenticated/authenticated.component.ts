import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MainMenuComponent} from "../../../../shared/components/main-menu/main-menu.component";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {NotificationsFacade} from "../../../../shared/state/notifications/notifications.facade";
import {NotificationsComponent} from "../../../dashboard/containers/notifications/notifications.component";
import {SidebarModule} from "primeng/sidebar";
import {slideInAnimation} from "../../../../shared/animations/route.animations";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  styleUrl: './authenticated.component.scss',
  animations: [slideInAnimation]

})
export class AuthenticatedComponent implements OnInit {

  public isFirstNavigation = true;
  private routeOrder = ['dashboard', 'guild', 'events', 'registry', 'eternal-harvest', 'profile'];
  private currentRouteIndex = 0;

  constructor(private router: Router) {
    this.notificationsFacade.loadNotifications().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isFirstNavigation = false;
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    if (this.isFirstNavigation) {
      return null;
    }

    if (outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']) {
      const newRoute = outlet.activatedRouteData['animation'];
      const newRouteIndex = this.routeOrder.indexOf(newRoute);

      if (newRouteIndex === -1) {
        return null;
      }

      const direction = newRouteIndex > this.currentRouteIndex ? '-100%' : '100%';
      const oppositeDirection = newRouteIndex > this.currentRouteIndex ? '100%' : '-100%';
      this.currentRouteIndex = newRouteIndex;

      return {value: outlet.activatedRouteData['animation'], params: {direction, oppositeDirection}};
    }

    return null;
  }


  showNotifications: WritableSignal<boolean> = signal(false);

  protected readonly scroll = scroll;
  private notificationsFacade = inject(NotificationsFacade);
  public readonly unreadNotificationsCount = this.notificationsFacade.unreadNotificationsCount;
  private readonly destroyRef = inject(DestroyRef);


  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
  }


}
