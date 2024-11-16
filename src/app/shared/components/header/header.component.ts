import {Component, inject, Signal} from '@angular/core';
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {UserDto} from "../../../routes/profile/state/users/user.model";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private authenticatedFacade = inject(AuthenticatedFacade);

  readonly user: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser!;

  logout() {
    this.authenticatedFacade.logout();
  }
}
