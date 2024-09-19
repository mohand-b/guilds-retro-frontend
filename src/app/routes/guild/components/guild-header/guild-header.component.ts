import {Component, computed, EventEmitter, inject, input, Input, Output, Signal} from '@angular/core';
import {GuildFacade} from "../../guild.facade";
import {GuildDto} from "../../state/guilds/guild.model";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {ClassCountComponent} from "../class-count/class-count.component";
import {UserDto} from "../../../profile/state/users/user.model";
import {AllianceRequestDto} from "../../state/alliances/alliance.model";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-guild-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    ClassCountComponent,
  ],
  templateUrl: './guild-header.component.html',
  styleUrl: './guild-header.component.scss'
})
export class GuildHeaderComponent {
  @Input() guild!: GuildDto;
  currentUser = input<UserDto>();
  pendingMembershipRequestsCount = input<number>(0);

  @Output() showMembershipRequests = new EventEmitter<void>();
  @Output() sendAllianceRequest = new EventEmitter<number>();
  @Output() acceptAllianceRequest = new EventEmitter<number>();
  @Output() declineAllianceRequest = new EventEmitter<number>();
  hasReceivedRequest: Signal<boolean | undefined> = computed(() =>
    this.receivedRequests()?.some(request => request.requesterGuild?.id === this.guild.id)
  );
  receivedRequestFromGuild: Signal<AllianceRequestDto | undefined> = computed(() =>
    this.receivedRequests()?.find(request => request.requesterGuild?.id === this.guild.id)
  );
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private guildFacade = inject(GuildFacade);
  receivedRequests = this.guildFacade.receivedPendingAllianceRequests;
  private sentRequests = this.guildFacade.sentPendingAllianceRequests;
  hasSentRequest: Signal<boolean | undefined> = computed(() =>
    this.sentRequests()?.some(request => request.targetGuild?.id === this.guild.id)
  );

  get isCurrentGuild() {
    return this.currentUser()?.guild.id === this.guild.id;
  }

  onShowMembershipRequests() {
    this.showMembershipRequests.emit();
  }

  onSendAllianceRequest() {
    this.sendAllianceRequest.emit(this.guild.id!);
  }

  onAcceptAllianceRequest() {
    this.acceptAllianceRequest.emit(this.receivedRequestFromGuild()?.id!);
  }

  onDeclineAllianceRequest() {
    this.declineAllianceRequest.emit(this.receivedRequestFromGuild()?.id!);
  }
}
