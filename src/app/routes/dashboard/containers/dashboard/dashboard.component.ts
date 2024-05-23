import {Component, inject} from '@angular/core';
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {FeedComponent} from "../../../feed/containers/feed/feed.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FeedComponent,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser: UserDto = this.authenticatedFacade.getCurrentUser()!;

}
