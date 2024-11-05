import {Component, effect, EventEmitter, input, Output} from '@angular/core';
import {GuildDto} from "../../state/guilds/guild.model";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CommonModule} from "@angular/common";
import {ClassCountComponent} from "../class-count/class-count.component";
import {UserDto} from "../../../profile/state/users/user.model";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-guild-header',
  standalone: true,
  imports: [
    CommonModule,
    ClassCountComponent,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    RouterLink,
    InputTextModule,
  ],
  templateUrl: './guild-header.component.html',
  styleUrl: './guild-header.component.scss'
})
export class GuildHeaderComponent {
  guild = input<GuildDto>();
  currentUser = input<UserDto>();
  pendingMembershipRequestsCount = input<number>(0);

  @Output() showMembershipRequests = new EventEmitter<void>();
  @Output() sendAllianceRequest = new EventEmitter<number>();
  @Output() acceptAllianceRequest = new EventEmitter<number>();
  @Output() declineAllianceRequest = new EventEmitter<number>();

  public guildForm = input<FormGroup>(new FormGroup({}));
  public editMode = input<boolean>(false);

  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;

  private updateGuildForm = effect(() => {
    if (this.guild()) {
      this.guildForm().patchValue(
        {level: this.guild()!.level, description: this.guild()!.description}
      );
    }
  });

}
