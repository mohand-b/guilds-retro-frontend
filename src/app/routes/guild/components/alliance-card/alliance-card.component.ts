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
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-alliance-card',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatIcon,
    NgIf,
    RouterLink,
    MatRipple
  ],
  templateUrl: './alliance-card.component.html',
  styleUrl: './alliance-card.component.scss'
})
export class AllianceCardComponent {

  @Input() guild!: GuildSummaryDto;
  private guildFacade = inject(GuildFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);

  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly currentUser$: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser$;

  public readonly UserRoleEnum = UserRoleEnum;

  get canDissolveAlliance(): boolean {
    return !this.activatedRoute.snapshot.params['guildId'] && hasRequiredRole(this.currentUser$()?.role!, UserRoleEnum.LEADER);
  }

  dissolveAlliance() {
    this.guildFacade.dissolveAlliance(this.guildFacade.currentGuild$().id!, this.guild.id).subscribe();
  }

  protected readonly hasRequiredRole = hasRequiredRole;
}
