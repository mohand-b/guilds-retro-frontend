import {LikeDto} from "../../../routes/feed/state/likes/like.model";
import {EventDto} from "../../../routes/events/state/events/event.model";
import {MembershipRequestDto} from "../../../routes/guild/state/membership-requests/membership-request.model";

export interface NotificationDto {
  id: number;
  type: NotificationTypeEnum;
  message: string;
  read: boolean;
  createdAt: Date;
  like?: LikeDto;
  event?: EventDto;
  accountLinkRequest?: any;
  membershipRequest?: MembershipRequestDto;
}

export enum NotificationTypeEnum {
  like = 'like',
  event = 'event',
  link_account = 'link_account',
  membership_request = 'membership_request'
}
