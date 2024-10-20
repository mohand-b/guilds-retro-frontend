import {Component, inject, Signal} from '@angular/core';
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {FeedComponent} from "../../../feed/containers/feed/feed.component";
import {NgIf} from "@angular/common";
import {UserMembershipRequestsComponent} from "../user-membership-requests/user-membership-requests.component";
import {NotificationsComponent} from "../notifications/notifications.component";
import {UserDto} from "../../../profile/state/users/user.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FeedComponent,
    NgIf,
    UserMembershipRequestsComponent,
    NotificationsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
}
