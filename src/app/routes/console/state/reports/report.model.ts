import {UserDto} from "../../../profile/state/users/user.model";
import {EventDto} from "../../../events/state/events/event.model";
import {PostDto} from "../../../feed/state/posts/post.model";

export interface ReportDto {
  id: number;
  reportType: ReportTypeEnum;
  reason: string;
  createdAt: Date;
  status: ReportStatusEnum;
  reporter: Pick<UserDto, 'id' | 'username'>;
  event?: EventDto;
  post?: PostDto;
  user?: UserDto;
}

export interface CreateReportDto {
  entityId: number;
  entityType: ReportTypeEnum;
  reason: string;
  reasonText: string;
}

export enum ReportStatusEnum {
  PENDING = 'pending',
  PROCESSED = 'processed',
}

export enum ReportTypeEnum {
  POST = 'post',
  USER = 'user',
  EVENT = 'event',
  COMMENT = 'comment',
}

export enum ReportReasonEnum {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  CHEATING = 'cheating',
  OTHER = 'other',
}
