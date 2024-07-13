import {Post} from "../posts/post.model";
import {EventDto} from "../../../events/state/events/event.model";

export interface PostFeedDto extends Post {
  feedId: string;
  feedType: string;
}

export interface EventFeedDto extends EventDto {
  feedId: string;
  feedType: string;
}

export type FeedItem = PostFeedDto | EventFeedDto;
