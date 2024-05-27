import {Pipe, PipeTransform} from '@angular/core';
import {UserDto, UserRoleEnum} from "../../routes/authenticated/state/authed/authed.model";

@Pipe({
  name: 'sortMembers',
  standalone: true
})
export class SortMembersPipe implements PipeTransform {

  transform(members: UserDto[]): UserDto[] {
    const rolePriority: { [key in UserRoleEnum]: number } = {
      [UserRoleEnum.LEADER]: 1,
      [UserRoleEnum.OFFICER]: 2,
      [UserRoleEnum.MEMBER]: 3,
      [UserRoleEnum.CANDIDATE]: 4
    };

    return members.sort((a: UserDto, b: UserDto) => {
      return rolePriority[a.role] - rolePriority[b.role];
    });
  }
}
