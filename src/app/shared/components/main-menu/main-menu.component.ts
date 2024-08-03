import {Component, inject, input, Input, InputSignal, Signal} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {UserDto, UserRoleEnum} from "../../../routes/authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../routes/authenticated/guards/role.guard";
import {NgIf} from "@angular/common";
import {MatBadge} from "@angular/material/badge";
import {MatDrawer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MenuItemComponent} from "../menu-item/menu-item.component";

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    NgIf,
    MatBadge,
    MatIcon,
    MenuItemComponent,
    RouterLinkActive
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  UserRoleEnum = UserRoleEnum;
  hasRequiredRole = hasRequiredRole;
  @Input() drawer!: MatDrawer;
  notificationsCount: InputSignal<number> = input<number>(0);
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;
}
