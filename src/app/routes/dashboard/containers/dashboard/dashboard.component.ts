import {Component, inject, Signal} from '@angular/core';
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {FeedComponent} from "../../../feed/containers/feed/feed.component";
import {NgIf} from "@angular/common";
import {UserMembershipRequestsComponent} from "../user-membership-requests/user-membership-requests.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FeedComponent,
    NgIf,
    UserMembershipRequestsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  protected readonly UserRoleEnum = UserRoleEnum;
  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;

}
