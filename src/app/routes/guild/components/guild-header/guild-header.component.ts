import {Component, computed, EventEmitter, inject, input, Input, Output, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto, GuildSummaryDto} from "../../state/guilds/guild.model";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";
import {ClassCountComponent} from "../class-count/class-count.component";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../profile/state/users/user.model";

@Component({
  selector: 'app-guild-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatBadge,
    ClassCountComponent
  ],
  templateUrl: './guild-header.component.html',
  styleUrl: './guild-header.component.scss'
})
export class GuildHeaderComponent {
  @Input() guild!: GuildDto | GuildSummaryDto;
  currentUser = input<UserDto>();
  pendingMembershipRequestsCount = input<number>(0);

  @Output() showMembershipRequests = new EventEmitter<void>();
  @Output() sendAllianceRequest = new EventEmitter<number>();
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private guildFacade = inject(GuildFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  private alliancesRequests = this.guildFacade.sentPendingAllianceRequests
  public alreadySentAllianceRequest: Signal<boolean> = computed(() => {
    const alreadyAlly = this.authenticatedFacade.currentUser()?.guildAlliesIds!
      .some((allyId: number) => allyId === this.guild.id)!;
    return alreadyAlly && this.alliancesRequests().some((request) => request.targetGuild!.id === this.guild.id);
  })

  onShowMembershipRequests() {
    this.showMembershipRequests.emit();
  }

  onSendAllianceRequest() {
    this.sendAllianceRequest.emit(this.guild.id!);
  }

  isGuildDto(guild: GuildDto | GuildSummaryDto): guild is GuildDto {
    return (guild as GuildDto).members !== undefined;
  }
}
