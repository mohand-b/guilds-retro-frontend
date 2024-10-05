import {Component, inject, Input, Signal} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {GuildSummaryDto} from "../../state/guilds/guild.model";
import {GuildFacade} from "../../guild.facade";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {NgIf} from "@angular/common";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatRipple} from "@angular/material/core";
import {GenericModalService} from "../../../../shared/services/generic-modal.service";
import {PermissionsService} from "../../../../shared/services/permissions.service";
import {UserDto} from "../../../profile/state/users/user.model";
import {EMPTY, switchMap} from "rxjs";

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
  public readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;
  private guildFacade = inject(GuildFacade);
  private authenticatedFacade = inject(AuthenticatedFacade);
  public readonly currentUser: Signal<UserDto | undefined> = this.authenticatedFacade.currentUser;
  private genericModalService = inject(GenericModalService);
  private permissionsService = inject(PermissionsService);
  private readonly activatedRoute = inject(ActivatedRoute);

  get canDissolveAlliance(): boolean {
    return this.permissionsService.canDissolveAlliance(this.currentUser()!, this.activatedRoute.snapshot.params['guildId']);
  }

  dissolveAlliance() {
    const ref = this.genericModalService.open(
      'Confirmation',
      {danger: 'Oui'},
      'sm',
      null,
      null,
      `Es-tu sûr de vouloir rompre l'alliance avec ${this.guild.name} ?`
    );

    ref.onClose.pipe(
      switchMap((result) => result ? this.guildFacade.dissolveAlliance(this.guildFacade.currentGuild().id!, this.guild.id) : EMPTY)
    ).subscribe();
  }

}
