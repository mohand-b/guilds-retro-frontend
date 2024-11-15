import {UserDto} from "../../../profile/state/users/user.model";
import {EventDto} from "../../../events/state/events/event.model";
import {PostDto} from "../../../feed/state/posts/post.model";
import {CommentDto} from "../../../feed/state/comments/comment.model";

export interface ReportDto {
  id: number;
  reportType: ReportTypeEnum;
  reason: string;
  createdAt: Date;
  status: ReportStatusEnum;
  reporter: Pick<UserDto, 'id' | 'username'>;
  event?: EventDto;
  post?: PostDto;
  comment?: CommentDto;
  user?: UserDto;
  resolvedAt?: Date;
  resolvedBy?: Pick<UserDto, 'id' | 'username'>;
  decision?: ReportDecisionEnum;
}

export interface PaginatedReports {
  data: ReportDto[];
  total: number;
  page: number;
  limit: number;
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

export enum ReportDecisionEnum {
  OBJECT_DELETED = 'object_deleted',
  IGNORED = 'ignored',
}
