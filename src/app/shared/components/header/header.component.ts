import {Component, inject, Signal} from '@angular/core';
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {NgIf} from "@angular/common";
import {UserDto} from "../../../routes/authenticated/state/authed/authed.model";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    MatIcon
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
