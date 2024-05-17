import {Pipe, PipeTransform} from "@angular/core";
import {UserDto} from "../../routes/authenticated/state/authed/authed.model";

@Pipe({
  name: 'guildMembership',
  standalone: true
})
export class GuildMembershipPipe implements PipeTransform {

  transform(user: UserDto, currentUser: UserDto): string {
    if (user.id === currentUser.id) {
      return 'currentUser';
    }
    if (user.guild.id === currentUser.guildId) {
      return 'myGuild';
    } else if (currentUser.guildAlliesIds?.some((allyId: number) => allyId === user.guildId)) {
      return 'alliedGuild';
    } else {
      return 'externalGuild';
    }
  }
}
