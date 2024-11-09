import {UserDto} from "../../../profile/state/users/user.model";
import {EventDto} from "../../../events/state/events/event.model";
import {PostDto} from "../../../feed/state/posts/post.model";

export interface ReportDto {
  id: number;
  reportType: ReportType;
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
  entityType: ReportType;
  reason: string;
  reasonText: string;
}

export enum ReportStatusEnum {
  PENDING = 'pending',
  PROCESSED = 'processed',
}

export type ReportType = 'post' | 'user' | 'event';

export enum ReportReasonEnum {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  CHEATING = 'cheating',
  OTHER = 'other',
}
