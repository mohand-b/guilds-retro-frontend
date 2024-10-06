import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  MembershipRequestDto,
  RequestStatusEnum
} from "../../../guild/state/membership-requests/membership-request.model";
import {BadgeModule} from "primeng/badge";
import {TagModule} from "primeng/tag";

@Component({
  selector: 'app-user-membership-request',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    TagModule
  ],
  templateUrl: './user-membership-request.component.html',
  styleUrl: './user-membership-request.component.scss'
})

export class UserMembershipRequestComponent {
  @Input() request!: MembershipRequestDto;

  statusClass: string = '';

  ngOnInit() {
    this.statusClass = this.getStatusClass();
  }

  getStatusIcon(): string {
    switch (this.request.status) {
      case RequestStatusEnum.PENDING:
        return 'pi-hourglass';
      case RequestStatusEnum.APPROVED:
        return 'pi-check';
      case RequestStatusEnum.REJECTED:
        return 'pi-times';
      default:
        return 'pi-info';
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

  getStatusSeverity(): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (this.request.status) {
      case RequestStatusEnum.PENDING:
        return 'warning';
      case RequestStatusEnum.APPROVED:
        return 'success';
      case RequestStatusEnum.REJECTED:
        return 'danger';
      default:
        return 'info';
    }
  }


}

