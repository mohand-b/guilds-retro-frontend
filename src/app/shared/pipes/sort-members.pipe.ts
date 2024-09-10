import {Pipe, PipeTransform} from '@angular/core';
import {UserRoleEnum} from "../../routes/authenticated/state/authed/authed.model";
import {MemberDto} from "../../routes/guild/state/guilds/guild.model";

@Pipe({
  name: 'sortMembers',
  standalone: true
})
export class SortMembersPipe implements PipeTransform {

  transform(members: MemberDto[]): MemberDto[] {
    const rolePriority: { [key in UserRoleEnum]: number } = {
      [UserRoleEnum.LEADER]: 1,
      [UserRoleEnum.OFFICER]: 2,
      [UserRoleEnum.MEMBER]: 3,
      [UserRoleEnum.CANDIDATE]: 4
    };

    return members.sort((a: MemberDto, b: MemberDto) => {
      return rolePriority[a.role] - rolePriority[b.role];
    });
  }
}
