import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-guild-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatBadge
  ],
  templateUrl: './guild-header.component.html',
  styleUrl: './guild-header.component.scss'
})
export class GuildHeaderComponent {

  @Input() guild!: GuildDto;
  @Input() currentUser!: UserDto;
  @Input() pendingMembershipRequestsCount!: number;

  @Output() showMembershipRequests = new EventEmitter<void>();

  private guildFacade = inject(GuildFacade);

  protected readonly UserRoleEnum = UserRoleEnum;

  onShowMembershipRequests() {
    this.showMembershipRequests.emit();
  }

  protected readonly hasRequiredRole = hasRequiredRole;
}
