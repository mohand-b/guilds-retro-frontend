import {Component, effect, EventEmitter, input, Input, Output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {MatCardModule} from "@angular/material/card";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {SortMembersPipe} from "../../../../shared/pipes/sort-members.pipe";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";
import {GuildDto, MemberDto} from "../../state/guilds/guild.model";
import {RouterLink} from "@angular/router";
import {UserDto} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-guild-members-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    SortMembersPipe,
    CharacterIconPipe,
    RouterLink
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorComponent},
  ],
  templateUrl: './guild-members-table.component.html',
  styleUrl: './guild-members-table.component.scss'
})
export class GuildMembersTableComponent {

  guild = input<GuildDto>();
  @Input() currentUser!: UserDto;

  displayedColumns: string[] = ['username', 'characterClass', 'characterLevel', 'role', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<MemberDto> = new MatTableDataSource<MemberDto>();
  public readonly UserRoleEnum = UserRoleEnum;
  @Output() roleUpdated = new EventEmitter<{ user: UserDto, role: UserRoleEnum }>();
  @Output() memberRemoved = new EventEmitter<UserDto>();
  change = effect(() => {
    const hasOfficerRole = hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER);
    const isGuildIdMatching = this.guild()!.id === this.currentUser.guild.id;

    const sortedMembers: MemberDto[] = new SortMembersPipe().transform(this.guild()!.members);
    this.dataSource.data = sortedMembers;
    this.dataSource.paginator = this.paginator;

    if (hasOfficerRole && isGuildIdMatching) {
      if (!this.displayedColumns.includes('actions')) {
        this.displayedColumns.push('actions');
      }
    } else {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'actions');
    }
  });

  updateRole(member: UserDto, role: UserRoleEnum) {
    this.roleUpdated.emit({user: member, role});
  }

  removeMember(member: UserDto) {
    this.memberRemoved.emit(member);
  }

  enableUpGradeAction(member: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER) &&
      member.role === UserRoleEnum.MEMBER;
  }

  enableDownGradeAction(member: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.LEADER) &&
      member.role === UserRoleEnum.OFFICER;
  }

  enableRemoveMemberAction(member: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.LEADER) &&
      member.role !== UserRoleEnum.LEADER && this.currentUser.id !== member.id;
  }

}
