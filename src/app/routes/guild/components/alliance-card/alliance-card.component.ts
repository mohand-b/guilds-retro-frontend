import {Component, inject, Input, Signal} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {GuildSummaryDto} from "../../state/guilds/guild.model";
import {GuildFacade} from "../../guild.facade";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {NgIf} from "@angular/common";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";

@Component({
  selector: 'app-alliance-card',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './alliance-card.component.html',
  styleUrl: './alliance-card.component.scss'
})
export class AllianceCardComponent {

  @Input() guild!: GuildSummaryDto;
  private guildFacade = inject(GuildFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);

  public readonly currentUser$: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;

  public readonly UserRoleEnum = UserRoleEnum;

  dissolveAlliance() {
    this.guildFacade.dissolveAlliance(this.guildFacade.currentGuild$().id!, this.guild.id).subscribe();
  }

  protected readonly hasRequiredRole = hasRequiredRole;
}
