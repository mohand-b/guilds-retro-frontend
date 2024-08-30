import {Injectable} from "@angular/core";
import {roleHierarchy, UserRoleEnum} from "../../routes/authenticated/state/authed/authed.model";
import {UserDto} from "../../routes/profile/state/users/user.model";

@Injectable({providedIn: 'root'})
export class PermissionsService {

  hasRequiredRole(userRole: UserRoleEnum, requiredRole: UserRoleEnum): boolean {
    if (userRole === requiredRole) {
      return true;
    }
    return roleHierarchy[userRole].includes(requiredRole);
  };

  canViewMembershipRequests(currentUser: UserDto, guildId: number): boolean {
    return currentUser.guild.id === guildId && this.hasRequiredRole(currentUser.role, UserRoleEnum.LEADER);
  }

  canProposeAlliance(currentUser: UserDto, guildId: number, isAlly: boolean, hasPendingRequest: boolean): boolean {
    return (
      currentUser.guild.id !== guildId &&
      this.hasRequiredRole(currentUser.role, UserRoleEnum.LEADER) &&
      !isAlly &&
      !hasPendingRequest
    );
  }

  canDissolveAlliance(currentUser: UserDto, guildId: number): boolean {
    return !guildId && this.hasRequiredRole(currentUser.role, UserRoleEnum.LEADER);
  }
}
