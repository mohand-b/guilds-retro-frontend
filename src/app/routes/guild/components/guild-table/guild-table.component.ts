import {Component, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {GuildDto} from "../../state/guilds/guild.model";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {SortMembersPipe} from "../../../../shared/pipes/sort-members.pipe";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {CustomPaginatorComponent} from "../../../../shared/components/custom-paginator/custom-paginator.component";
import {GuildFacade} from "../../guild.facade";
import {MatIcon} from "@angular/material/icon";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {EMPTY, switchMap} from "rxjs";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";

@Component({
  selector: 'app-guild-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    CharacterIconPipe,
    MatPaginatorModule,
    MatIcon
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorComponent},
  ],
  templateUrl: './guild-table.component.html',
  styleUrl: './guild-table.component.scss'
})
export class GuildTableComponent implements OnChanges {

  @Input() guild!: GuildDto;
  @Input() currentUser!: UserDto;

  displayedColumns: string[] = ['username', 'characterClass', 'characterLevel', 'role', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<UserDto> = new MatTableDataSource<UserDto>();
  public readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private guildFacade = inject(GuildFacade);
  private genericModalService = inject(GenericModalService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['guild'] && this.guild) {
      const sortedMembers: UserDto[] = new SortMembersPipe().transform(this.guild.members);
      this.dataSource.data = sortedMembers;
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER) ?
        this.displayedColumns : this.displayedColumns.filter(column => column !== 'actions');
    }
  }

  updateRole(user: UserDto, role: UserRoleEnum) {
    this.genericModalService.open(
      'Confirmation',
      {primary: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir changer le rôle de ${user.username} à ${role} ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return this.guildFacade.updateUserRole(user.id, role)
        else return EMPTY
      })
    ).subscribe()
  }

  removeMember(user: UserDto) {
    this.genericModalService.open(
      'Confirmation',
      {warn: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir exclure ${user.username} de la guilde sur Guilds Retro ?`,
    ).pipe(
      switchMap((result) => {
        if (result) return EMPTY
        else return EMPTY
      })
    ).subscribe()

  }

  enableUpGradeAction(user: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.OFFICER) &&
      user.role === UserRoleEnum.MEMBER;
  }

  enableDownGradeAction(user: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.LEADER) &&
      user.role === UserRoleEnum.OFFICER;
  }

  enableRemoveMemberAction(user: UserDto): boolean {
    return hasRequiredRole(this.currentUser.role, UserRoleEnum.LEADER) && user.role !== UserRoleEnum.LEADER && this.currentUser.id !== user.id;
  }


}
