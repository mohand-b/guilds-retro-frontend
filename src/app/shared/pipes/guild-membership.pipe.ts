import {inject, Pipe, PipeTransform} from "@angular/core";
import {UserDto} from "../../routes/authenticated/state/authed/authed.model";
import {AuthenticatedFacade} from "../../routes/authenticated/authenticated.facade";

@Pipe({
  name: 'guildMembership',
  standalone: true
})
export class GuildMembershipPipe implements PipeTransform {

  private authenticatedFacade = inject(AuthenticatedFacade);
  currentUser$ = this.authenticatedFacade.currentUser$;

  transform(user: UserDto, currentUser: UserDto): string {
    if (user.id === this.currentUser$()!.id) {
      return 'currentUser';
    }
    if (user.guild.id === this.currentUser$()!.guild.id) {
      return 'myGuild';
    } else if (this.currentUser$()!.guildAlliesIds?.some((allyId: number) => allyId === user.guild.id)) {
      return 'alliedGuild';
    } else {
      return 'externalGuild';
    }
  }
}
