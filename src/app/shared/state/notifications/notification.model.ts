import {LikeDto} from "../../../routes/feed/state/likes/like.model";
import {EventDto} from "../../../routes/events/state/events/event.model";

export interface NotificationDto {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  like?: LikeDto;
  event?: EventDto;
}
