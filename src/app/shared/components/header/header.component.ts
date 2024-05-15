import {Component, inject} from '@angular/core';
import {AuthenticatedFacade} from "../../../routes/authenticated/authenticated.facade";
import {NgIf} from "@angular/common";
import {GuildDto} from "../../../routes/guild/state/guilds/guild.model";
import {UserDto} from "../../../routes/authenticated/state/authed/authed.model";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private authenticatedFacade = inject(AuthenticatedFacade);

  readonly user: Omit<UserDto, 'guild'> = this.authenticatedFacade.getCurrentUser()!;
  readonly guild: Pick<GuildDto, "id" | "name" | "description" | "logo"> = this.authenticatedFacade.getGuild()!;

  logout() {
    this.authenticatedFacade.logout();
  }
}
