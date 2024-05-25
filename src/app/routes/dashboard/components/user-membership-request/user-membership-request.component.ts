import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {
  MembershipRequestDto,
  RequestStatusEnum
} from "../../../guild/state/membership-requests/membership-request.model";

@Component({
  selector: 'app-user-membership-request',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule
  ],
  templateUrl: './user-membership-request.component.html',
  styleUrl: './user-membership-request.component.scss'
})
export class UserMembershipRequestComponent {

  @Input() request!: MembershipRequestDto;

  getStatusIcon(): string {
    switch (this.request.status) {
      case RequestStatusEnum.PENDING:
        return 'hourglass_empty';
      case RequestStatusEnum.APPROVED:
        return 'check_circle';
      case RequestStatusEnum.REJECTED:
        return 'cancel';
      default:
        return 'info';
    }
  }

  getStatusClass(): string {
    switch (this.request.status) {
      case RequestStatusEnum.PENDING:
        return 'text-yellow-500';
      case RequestStatusEnum.APPROVED:
        return 'text-green-500';
      case RequestStatusEnum.REJECTED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }
}
