import {Component, inject} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {UserRoleEnum} from "../../../routes/authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../routes/authenticated/guards/role.guard";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    NgIf
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  UserRoleEnum = UserRoleEnum;
  hasRequiredRole = hasRequiredRole;
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUserRole: UserRoleEnum = this.authenticatedFacade.getCurrentUser()?.role!;

}
