import {Component, EventEmitter, inject, input, InputSignal, Output, Signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {UserRoleEnum} from "../../../routes/authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../routes/authenticated/guards/role.guard";
import {MenuItemComponent} from "../menu-item/menu-item.component";
import {UserDto} from "../../../routes/profile/state/users/user.model";
import {ToolbarModule} from "primeng/toolbar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
    MenuItemComponent,
    RouterLinkActive,
    ToolbarModule,
    ButtonModule,
    BadgeModule
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
  @Output() toggleNotifications = new EventEmitter<void>();
  notificationsCount: InputSignal<number> = input<number>(0);
  UserRoleEnum = UserRoleEnum;
  hasRequiredRole = hasRequiredRole;
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
}
