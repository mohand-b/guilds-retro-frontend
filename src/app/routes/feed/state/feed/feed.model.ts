import {PostDto} from "../posts/post.model";
import {EventDto} from "../../../events/state/events/event.model";

export interface FeedDto {
  id: number,
  post?: PostDto,
  event?: EventDto,
  createdAt: string
}
