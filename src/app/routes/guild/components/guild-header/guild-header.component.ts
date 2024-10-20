import {Component, effect, EventEmitter, Input, input, Output, signal, WritableSignal} from '@angular/core';
import {GuildDto} from "../../state/guilds/guild.model";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";
import {hasRequiredRole} from "../../../authenticated/guards/role.guard";
import {CommonModule} from "@angular/common";
import {ClassCountComponent} from "../class-count/class-count.component";
import {UserDto} from "../../../profile/state/users/user.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

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
  @Output() updateGuildLevel = new EventEmitter<number>();
  public guildLevelControl = new FormControl();
  @Input() editMode: WritableSignal<boolean> = signal(false);
  protected readonly UserRoleEnum = UserRoleEnum;
  protected readonly hasRequiredRole = hasRequiredRole;

  private updateGuildLevelControl = effect(() => {
    if (this.guild()) {
      this.guildLevelControl.setValue(this.guild()!.level);
    }
  });

  get isCurrentGuild() {
    return this.currentUser()?.guild.id === this.guild()!.id;
  }

  onUpdateGuildLevel() {
    this.updateGuildLevel.emit(this.guildLevelControl.value!);
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }
}
