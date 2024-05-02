import {Component, inject} from '@angular/core';
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {GuildDto, UserDto} from "../../../routes/authenticated/state/authed/authed.model";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private authenticatedFacade = inject(AuthenticatedFacade);

  readonly user: Omit<UserDto, 'guild'> = this.authenticatedFacade.getCurrentUser()!;
  readonly guild: Pick<GuildDto, "id" | "name" | "description"> = this.authenticatedFacade.getGuild()!;

  logout() {
    this.authenticatedFacade.logout();
  }
}
