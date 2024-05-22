import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {Post} from "../posts/post.model";

export interface LikeDto {
  id: number;
  user: UserDto;
  post: Post;
}
