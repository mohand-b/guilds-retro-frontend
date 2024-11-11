import {LikeDto} from "../../../routes/feed/state/likes/like.model";
import {EventDto} from "../../../routes/events/state/events/event.model";
import {MembershipRequestDto} from "../../../routes/guild/state/membership-requests/membership-request.model";
import {UserDto} from "../../../routes/profile/state/users/user.model";
import {AllianceRequestDto} from "../../../routes/guild/state/alliances/alliance.model";
import {CommentDto} from "../../../routes/feed/state/comments/comment.model";

export interface NotificationDto {
  id: number;
  type: NotificationTypeEnum;
  message: string;
  read: boolean;
  createdAt: Date;
  like?: LikeDto;
  comment?: CommentDto;
  event?: EventDto;
  alliance?: AllianceRequestDto;
  accountLinkRequest?: any;
  membershipRequest?: MembershipRequestDto;
  emitter?: Pick<UserDto, 'id' | 'username'>;
  groupedNotificationIds?: number[];
}

export enum NotificationTypeEnum {
  notification = 'notification',
  like = 'like',
  comment = 'comment',
  event = 'event',
  link_account = 'link_account',
  membership_request = 'membership_request',
  alliance_request = 'alliance_request',
}
