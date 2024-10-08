import {Component, computed, EventEmitter, input, Input, Output, Signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {GuildDto, MemberDto} from "../../state/guilds/guild.model";
import {RouterLink} from "@angular/router";
import {UserDto} from "../../../profile/state/users/user.model";
import {ButtonModule} from "primeng/button";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {SortMembersPipe} from "../../../../shared/pipes/sort-members.pipe";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";


@Component({
  selector: 'app-guild-members-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    PaginatorModule,
    TableModule,
    CharacterIconPipe
  ],
  templateUrl: './guild-members-table.component.html',
  styleUrls: ['./guild-members-table.component.scss']
})
export class GuildMembersTableComponent {

  guild = input<GuildDto>();
  @Input() currentUser!: UserDto;

  public readonly UserRoleEnum = UserRoleEnum;
  @Output() roleUpdated = new EventEmitter<{ user: MemberDto, role: UserRoleEnum }>();
  @Output() memberRemoved = new EventEmitter<MemberDto>();

  sortedMembers: Signal<MemberDto[]> = computed(() => {
    return new SortMembersPipe().transform(this.guild()!.members);
  })

  get isCurrentGuild(): boolean {
    return this.guild()?.id === this.currentUser.guild.id;
  }

  updateRole(member: MemberDto, role: UserRoleEnum) {
    this.roleUpdated.emit({user: member, role});
  }

  removeMember(member: MemberDto) {
    this.memberRemoved.emit(member);
  }

  enableUpGradeAction(member: MemberDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER)
      && member.role === UserRoleEnum.MEMBER
      && this.currentUser.id !== member.id;
  }

  enableDownGradeAction(member: MemberDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER)
      && member.role === UserRoleEnum.OFFICER
      && this.currentUser.id !== member.id;
  }

  enableRemoveMemberAction(member: MemberDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.LEADER)
      && member.role !== UserRoleEnum.LEADER
      && this.currentUser.id !== member.id;
  }

  protected readonly hasRequiredRole = hasRequiredRole;
}
